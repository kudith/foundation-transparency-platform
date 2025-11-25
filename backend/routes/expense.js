import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from "../controllers/expense.js";

const router = express.Router();

router.get("/", getAllExpenses);
router.get("/stats", getExpenseStats);
router.get("/:id", getExpenseById);
router.post("/", authenticate, createExpense);
router.put("/:id", authenticate, updateExpense);
router.delete("/:id", authenticate, deleteExpense);

export default router;
