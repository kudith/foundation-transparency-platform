import * as expenseService from "../services/expense.js";

export const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.getAllExpenses(req.query);
    res.json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.body);
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.params.id);
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getExpenseStats = async (req, res, next) => {
  try {
    const stats = await expenseService.getExpenseStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
