import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "financial_summary",
      "program_impact",
      "participant_demographics",
      "community_activity",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  fileURL: {
    type: String,
    default: "",
  },
  errorMsg: {
    type: String,
    default: "",
  },
  filters: {
    // Filter umum untuk semua tipe report - simpan sebagai string ISO 8601
    start_date: { type: String },
    end_date: { type: String },

    // Filter khusus untuk community_activity dan program_impact
    community_name: { type: String },

    // Filter khusus untuk participant_demographics
    communities: [{ type: String }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Report", ReportSchema);
