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
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
