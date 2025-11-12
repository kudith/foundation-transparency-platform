import mongoose from "mongoose";

const financeReportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
      unique: true,
    },
    income: {
      type: Number,
      required: [true, "Income is required"],
      min: [0, "Income cannot be negative"],
      default: 0,
    },
    expenses: {
      type: Number,
      required: [true, "Expenses is required"],
      min: [0, "Expenses cannot be negative"],
      default: 0,
    },
    balance: {
      type: Number,
      required: [true, "Balance is required"],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware untuk menghitung balance otomatis sebelum save
financeReportSchema.pre("save", function (next) {
  this.balance = this.income - this.expenses;
  next();
});

// Index
financeReportSchema.index({ projectId: 1 });

const FinanceReport = mongoose.model("FinanceReport", financeReportSchema);

export default FinanceReport;
