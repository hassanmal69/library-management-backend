import db from "../models/index.js";
import { Op } from "sequelize";

const { User } = db;

export class UserRepository {
  async findAll({ limit, offset, order, where = {} }) {
    return await User.findAndCountAll({ 
      limit, 
      offset, 
      order,
      where,
      attributes: { exclude: ['password'] }  // password nahi bhejna
    });
  }

  async findById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findByMemberId(memberId) {
    return await User.findOne({ where: { memberId } });
  }

  async create(data) {
    return await User.create(data);
  }

  async update(user, data) {
    return await user.update(data);
  }

  async delete(user) {
    return await user.destroy();
  }

  async getStats() {
    const totalMembers = await User.count();
    const activeToday = await User.count({ 
      where: { 
        lastActive: { [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) }
      } 
    });
    const pendingApprovals = await User.count({ where: { status: 'pending' } });
    const blockedUsers = await User.count({ where: { status: 'blocked' } });
    
    return { totalMembers, activeToday, pendingApprovals, blockedUsers };
  }
}

export default new UserRepository();