import express from "express";
import {
  getAllLoans,
  getLoanById,
  getActiveLoansByUser,
  issueBook,
  returnBook,
  getOverdueLoans,
  getLoanStats
} from "../controllers/loan.controller.js";

const router = express.Router();

router.get("/", getAllLoans);
router.get("/stats", getLoanStats);
router.get("/overdue", getOverdueLoans);
router.get("/:id", getLoanById);
router.get("/user/:userId", getActiveLoansByUser);
router.post("/issue", issueBook);
router.post("/return", returnBook);

export default router;