import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "active", "completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    gallery: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
    finance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinanceReport",
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk pencarian
projectSchema.index({ title: "text", description: "text" });
projectSchema.index({ status: 1, startDate: -1 });
projectSchema.index({ createdBy: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
