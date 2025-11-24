import mongoose from "mongoose";

const MilestoneDetailSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const MilestoneSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ID
  userID: { type: String, required: true },
  type: { type: String, required: true }, // e.g. "project_submitted"
  detail: { type: MilestoneDetailSchema, required: true },
});

export default mongoose.model("Milestone", MilestoneSchema);
