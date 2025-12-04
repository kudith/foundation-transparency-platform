import mongoose from "mongoose";

// Milestone types
export const MILESTONE_TYPES = {
  PROJECT_SUBMITTED: "project_submitted",
  LEVEL_UP: "level_up",
  JOB_PLACEMENT: "job_placement",
};

// Detail schema untuk project_submitted
const ProjectSubmittedDetailSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { _id: false }
);

// Detail schema untuk level_up
const LevelUpDetailSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false }
);

// Detail schema untuk job_placement
const JobPlacementDetailSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
  },
  { _id: false }
);

const MilestoneSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userID: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: {
      values: Object.values(MILESTONE_TYPES),
      message: "Type must be one of: project_submitted, level_up, job_placement",
    },
  },
  // Detail is flexible - structure depends on type
  detail: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  date: { type: Date, required: true },
});

// Validation middleware to check detail structure based on type
MilestoneSchema.pre("validate", function (next) {
  const type = this.type;
  const detail = this.detail;

  if (!detail) {
    return next(new Error("Detail is required"));
  }

  switch (type) {
    case MILESTONE_TYPES.PROJECT_SUBMITTED:
      if (!detail.title) {
        return next(new Error("Title is required for project_submitted milestone"));
      }
      break;
    case MILESTONE_TYPES.LEVEL_UP:
      if (!detail.from || !detail.to) {
        return next(new Error("From and To are required for level_up milestone"));
      }
      break;
    case MILESTONE_TYPES.JOB_PLACEMENT:
      if (!detail.company || !detail.role) {
        return next(new Error("Company and Role are required for job_placement milestone"));
      }
      break;
    default:
      return next(new Error("Invalid milestone type"));
  }

  next();
});

export default mongoose.model("Milestone", MilestoneSchema);
