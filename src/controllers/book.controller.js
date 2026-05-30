import bookService, { NotFoundError, ValidationError } from "../services/book.service.js";

const handleError = (res, err) => {
  if (err instanceof NotFoundError) return res.status(404).json({ success: false, message: err.message });
  if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
  return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
};

export const getAllBooks = async (req, res) => {
  try {
    const { page, limit, sortBy, order } = req.query;
    const result = await bookService.getAllBooks({ page, limit, sortBy, order });
    res.json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.json({ success: true, data: book });
  } catch (err) {
    handleError(res, err);
  }
};

export const createBook = async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.json({ success: true, data: book });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteBook = async (req, res) => {
  try {
    const result = await bookService.deleteBook(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};