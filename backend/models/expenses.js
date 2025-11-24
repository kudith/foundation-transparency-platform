import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ID
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, required: true },
});

export default mongoose.model("Expense", ExpenseSchema);
