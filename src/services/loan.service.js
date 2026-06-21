import loanRepository from "../repositories/loan.repositories.js";
import userRepository from "../repositories/user.repositories.js";
import bookRepository from "../repositories/book.repositories.js";
import { NotFoundError, ValidationError } from "./book.service.js";
import db from "../models/index.js";
const { Loan } = db;

const MAX_BOOKS_PER_USER = 5;
const DEFAULT_LOAN_DAYS = 14;
const FINE_PER_DAY = 10;

export class LoanService {
  async getAllLoans({ page = 1, limit = 10, sortBy = "createdAt", order = "DESC", status } = {}) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const allowedSortFields = ["id", "userId", "bookId", "issueDate", "dueDate", "status", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const where = {};
    if (status) where.status = status;

    const { count, rows } = await loanRepository.findAll({
      limit: limitNum,
      offset,
      order: [[sortField, sortOrder]],
      where
    });

    const totalPages = Math.ceil(count / limitNum);

    return {
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNum,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }

  async getLoanById(id) {
    const loan = await loanRepository.findById(id);
    if (!loan) throw new NotFoundError("Loan record not found");
    return loan;
  }

  async getActiveLoansByUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return await loanRepository.findActiveByUser(userId);
  }

  async issueBook(userId, bookId, days = DEFAULT_LOAN_DAYS) {
    // Check user exists and is active
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    if (user.status !== 'active') {
      throw new ValidationError("User is not active. Cannot issue book.");
    }

    // Check book exists and is available
    const book = await bookRepository.findById(bookId);
    if (!book) throw new NotFoundError("Book not found");
    if (book.available < 1) {
      throw new ValidationError("Book is not available for issue");
    }

    // Check user doesn't exceed max books limit
    const activeLoans = await loanRepository.findActiveByUser(userId);
    if (activeLoans.length >= MAX_BOOKS_PER_USER) {
      throw new ValidationError(`User already has ${MAX_BOOKS_PER_USER} books. Cannot issue more.`);
    }

    // Calculate due date
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    // Create loan
    const loan = await loanRepository.create({
      userId,
      bookId,
      issueDate,
      dueDate,
      status: 'issued'
    });

    // Update book availability
    await bookRepository.update(book, { 
      available: book.available - 1 
    });

    return await loanRepository.findById(loan.id);
  }

  async returnBook(loanId) {
    const loan = await loanRepository.findById(loanId);
    if (!loan) throw new NotFoundError("Loan record not found");

    if (loan.status === 'returned') {
      throw new ValidationError("Book already returned");
    }

    const returnDate = new Date();
    let fineAmount = 0;
    let status = 'returned';

    // Calculate fine if overdue
    if (returnDate > loan.dueDate) {
      const daysOverdue = Math.ceil((returnDate - loan.dueDate) / (1000 * 60 * 60 * 24));
      fineAmount = daysOverdue * FINE_PER_DAY;
      status = 'overdue';
    }

    // Update loan
    const updatedLoan = await loanRepository.update(loan, {
      returnDate,
      fineAmount,
      status
    });

    // Update book availability
    const book = await bookRepository.findById(loan.bookId);
    if (book) {
      await bookRepository.update(book, {
        available: book.available + 1
      });
    }

    return await loanRepository.findById(loan.id);
  }

  async getOverdueLoans() {
    return await loanRepository.findOverdue();
  }

  async getLoanStats() {
    const totalIssued = await Loan.count({ where: { status: 'issued' } });
    const totalOverdue = await Loan.count({ where: { status: 'overdue' } });
    const totalReturned = await Loan.count({ where: { status: 'returned' } });
    const totalFineCollected = await Loan.sum('fineAmount');
    
    return { 
      totalIssued, 
      totalOverdue, 
      totalReturned,
      totalFineCollected
    };
  }
}

export default new LoanService();