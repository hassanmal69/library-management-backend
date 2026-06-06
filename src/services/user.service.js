import userRepository from "../repositories/user.repositories.js";
import { NotFoundError, ValidationError } from "./book.service.js";
import bcrypt from "bcryptjs";

export class UserService {
  async getAllUsers({ page = 1, limit = 10, sortBy = "createdAt", order = "DESC", role, status } = {}) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const allowedSortFields = ["id", "name", "email", "role", "status", "createdAt", "updatedAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Filters
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;

    const { count, rows } = await userRepository.findAll({
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

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async createUser(data) {
    const { name, email, password, role, department, phone } = data;

    if (!name || !email || !password) {
      throw new ValidationError("name, email, and password are required");
    }

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique member ID
    const memberId = `LBB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newUser = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      memberId,
      role: role || "student",
      status: "pending",
      department,
      phone
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
  }

  async updateUser(id, data) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");

    // Agar email update ho rahi hai to check karo
    if (data.email && data.email !== user.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ValidationError("Email already in use");
      }
    }

    // Agar password update ho raha hai to hash karo
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await userRepository.update(user, data);
    const { password: _, ...userWithoutPassword } = updatedUser.toJSON();
    return userWithoutPassword;
  }

  async updateUserStatus(id, status) {
    const allowedStatuses = ["active", "blocked", "pending"];
    if (!allowedStatuses.includes(status)) {
      throw new ValidationError("Invalid status. Allowed: active, blocked, pending");
    }

    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");

    const updatedUser = await userRepository.update(user, { status });
    const { password: _, ...userWithoutPassword } = updatedUser.toJSON();
    return userWithoutPassword;
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    await userRepository.delete(user);
    return { message: "User deleted successfully" };
  }

  async getUserStats() {
    return await userRepository.getStats();
  }
}

export default new UserService();