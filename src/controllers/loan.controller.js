import loanService from "../services/loan.service.js";
import { NotFoundError, ValidationError } from "../services/book.service.js";

const handleError = (res, err) => {
  if (err instanceof NotFoundError) return res.status(404).json({ success: false, message: err.message });
  if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
  return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
};

export const getAllLoans = async (req, res) => {
  try {
    const { page, limit, sortBy, order, status } = req.query;
    const result = await loanService.getAllLoans({ page, limit, sortBy, order, status });
    res.json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

export const getLoanById = async (req, res) => {
  try {
    const loan = await loanService.getLoanById(req.params.id);
    res.json({ success: true, data: loan });
  } catch (err) {
    handleError(res, err);
  }
};

export const getActiveLoansByUser = async (req, res) => {
  try {
    const loans = await loanService.getActiveLoansByUser(req.params.userId);
    res.json({ success: true, data: loans });
  } catch (err) {
    handleError(res, err);
  }
};

export const issueBook = async (req, res) => {
  try {
    const { userId, bookId, days } = req.body;
    const loan = await loanService.issueBook(userId, bookId, days);
    res.status(201).json({ success: true, data: loan });
  } catch (err) {
    handleError(res, err);
  }
};

export const returnBook = async (req, res) => {
  try {
    const { loanId } = req.body;
    const loan = await loanService.returnBook(loanId);
    res.json({ success: true, data: loan });
  } catch (err) {
    handleError(res, err);
  }
};

export const getOverdueLoans = async (req, res) => {
  try {
    const loans = await loanService.getOverdueLoans();
    res.json({ success: true, data: loans });
  } catch (err) {
    handleError(res, err);
  }
};

export const getLoanStats = async (req, res) => {
  try {
    const stats = await loanService.getLoanStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    handleError(res, err);
  }
};