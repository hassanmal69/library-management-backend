import db from "../models/index.js";

const { Book } = db;

export class BookRepository {
  async findAll({ limit, offset, order }) {
    return await Book.findAndCountAll({ limit, offset, order });
  }

  async findById(id) {
    return await Book.findByPk(id);
  }

  async create(data) {
    return await Book.create(data);
  }

  async update(book, data) {
    return await book.update(data);
  }

  async delete(book) {
    return await book.destroy();
  }
}

export default new BookRepository();