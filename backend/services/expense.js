import Expense from "../models/expenses.js";
import mongoose from "mongoose";

// Helper to query by ID (handles both ObjectId and String formats)
const findByIdFlexible = async (Model, id) => {
  let doc = null;
  
  // Try as ObjectId first (for data imported with ObjectId _id)
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      doc = await Model.collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    } catch (e) {
      // Ignore and try as string
    }
  }
  
  // If not found, try as string
  if (!doc) {
    doc = await Model.collection.findOne({ _id: id });
  }
  
  return doc;
};

export const getAllExpenses = async (filters = {}) => {
  const query = {};

  if (filters.category) {
    query.category = new RegExp(filters.category, "i");
  }

  if (filters.startDate && filters.endDate) {
    query.date = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  if (filters.minAmount && filters.maxAmount) {
    query.amount = {
      $gte: parseFloat(filters.minAmount),
      $lte: parseFloat(filters.maxAmount),
    };
  }

  return await Expense.find(query).sort({ date: -1 });
};

export const getExpenseById = async (id) => {
  const expense = await findByIdFlexible(Expense, id);
  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }
  return expense;
};

export const createExpense = async (expenseData) => {
  if (!expenseData.category) {
    const error = new Error("Category is required");
    error.statusCode = 400;
    throw error;
  }

  if (!expenseData.amount || expenseData.amount <= 0) {
    const error = new Error("Amount must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  if (!expenseData.date) {
    const error = new Error("Date is required");
    error.statusCode = 400;
    throw error;
  }

  const expense = new Expense({
    _id: new mongoose.Types.ObjectId().toString(),
    category: expenseData.category,
    amount: expenseData.amount,
    description: expenseData.description || "",
    date: expenseData.date,
  });

  return await expense.save();
};

export const updateExpense = async (id, expenseData) => {
  if (expenseData.amount && expenseData.amount <= 0) {
    const error = new Error("Amount must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  const updateData = {};

  if (expenseData.category) updateData.category = expenseData.category;
  if (expenseData.amount) updateData.amount = expenseData.amount;
  if (expenseData.description !== undefined)
    updateData.description = expenseData.description;
  if (expenseData.date) updateData.date = expenseData.date;

  // Try ObjectId first, then string
  let expense = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      expense = await Expense.collection.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    } catch (e) {
      // Ignore
    }
  }
  
  if (!expense) {
    expense = await Expense.collection.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
  }

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  return expense;
};

export const deleteExpense = async (id) => {
  // Try ObjectId first, then string
  let expense = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      expense = await Expense.collection.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
    } catch (e) {
      // Ignore
    }
  }
  
  if (!expense) {
    expense = await Expense.collection.findOneAndDelete({ _id: id });
  }

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  return expense;
};

export const getExpenseStats = async () => {
  const stats = await Expense.aggregate([
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
        avgAmount: { $avg: "$amount" },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);

  const totalExpenses = await Expense.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    byCategory: stats,
    overall: totalExpenses[0] || { total: 0, count: 0 },
  };
};
