import db from "../models/index.js";
import { Op } from "sequelize";

const { Loan } = db;

export class LoanRepository {
  async findAll({ limit, offset, order, where = {} }) {
    return await Loan.findAndCountAll({ 
      limit, 
      offset, 
      order,
      where,
      include: [
        { association: 'user', attributes: ['id', 'name', 'email', 'memberId'] },
        { association: 'book', attributes: ['id', 'title', 'author', 'isbn'] }
      ]
    });
  }

  async findById(id) {
    return await Loan.findByPk(id, {
      include: [
        { association: 'user', attributes: ['id', 'name', 'email', 'memberId'] },
        { association: 'book', attributes: ['id', 'title', 'author', 'isbn'] }
      ]
    });
  }

  async findActiveByUser(userId) {
    return await Loan.findAll({
      where: { 
        userId, 
        status: 'issued' 
      },
      include: [
        { association: 'book', attributes: ['id', 'title', 'author', 'isbn'] }
      ]
    });
  }

  async findActiveByBook(bookId) {
    return await Loan.findAll({
      where: { 
        bookId, 
        status: 'issued' 
      }
    });
  }

  async findOverdue() {
    return await Loan.findAll({
      where: {
        status: 'issued',
        dueDate: { [Op.lt]: new Date() }
      },
      include: [
        { association: 'user', attributes: ['id', 'name', 'email'] },
        { association: 'book', attributes: ['id', 'title', 'author'] }
      ]
    });
  }

  async create(data) {
    return await Loan.create(data);
  }

  async update(loan, data) {
    return await loan.update(data);
  }
}

export default new LoanRepository();