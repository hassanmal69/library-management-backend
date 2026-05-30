import bookRepository from "../repositories/book.repositories.js";

export class BookService {
  async getAllBooks({ page = 1, limit = 10, sortBy = "createdAt", order = "DESC" } = {}) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const allowedSortFields = ["id", "title", "author", "isbn", "publishedYear", "createdAt", "updatedAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count, rows } = await bookRepository.findAll({
      limit: limitNum,
      offset,
      order: [[sortField, sortOrder]],
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

  async getBookById(id) {
    const book = await bookRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    return book;
  }

  async createBook(data) {
    const { title, author, isbn, publishedYear, quantity, available } = data;

    if (!title || !author || !isbn) {
      throw new ValidationError("title, author, and isbn are required");
    }

    return await bookRepository.create({ title, author, isbn, publishedYear, quantity, available });
  }

  async updateBook(id, data) {
    const book = await bookRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    return await bookRepository.update(book, data);
  }

  async deleteBook(id) {
    const book = await bookRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    await bookRepository.delete(book);
    return { message: "Book deleted successfully" };
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

export default new BookService();