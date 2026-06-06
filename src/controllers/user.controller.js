import userService from "../services/user.service.js";
import { NotFoundError, ValidationError } from "../services/book.service.js";

const handleError = (res, err) => {
  if (err instanceof NotFoundError) return res.status(404).json({ success: false, message: err.message });
  if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
  return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, sortBy, order, role, status } = req.query;
    const result = await userService.getAllUsers({ page, limit, sortBy, order, role, status });
    res.json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    handleError(res, err);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await userService.updateUserStatus(req.params.id, status);
    res.json({ success: true, data: user });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    handleError(res, err);
  }
};