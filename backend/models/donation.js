import mongoose from "mongoose";

const CashDetailsSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const InKindDetailsSchema = new mongoose.Schema(
  {
    estimatedValue: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
  },
  { _id: false }
);

const DonationSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ID
  donationType: { type: String, enum: ["Cash", "InKind"], required: true },
  source: { type: String, required: true },
  program: { type: String, required: true },
  cashDetails: { type: CashDetailsSchema },
  inKindDetails: { type: InKindDetailsSchema },
  date: { type: Date, required: true },
});

export default mongoose.model("Donation", DonationSchema);
