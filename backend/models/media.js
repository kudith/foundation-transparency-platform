import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    type: {
      type: String,
      enum: {
        values: ["image", "video", "document"],
        message: "{VALUE} is not a valid media type",
      },
      required: [true, "Media type is required"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [500, "Caption cannot exceed 500 characters"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploaded by is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk query yang sering digunakan
mediaSchema.index({ projectId: 1, createdAt: -1 });
mediaSchema.index({ type: 1 });
mediaSchema.index({ uploadedBy: 1 });

const Media = mongoose.model("Media", mediaSchema);

export default Media;
