import mongoose from "mongoose";

const ImageJobSchema = new mongoose.Schema({
  // _id akan auto-generated sebagai ObjectID oleh Mongoose
  entityType: { 
    type: String, 
    enum: ["event", "report", "other"], 
    required: true 
  },
  entityId: { type: String, required: true },
  sourceImageURL: { type: String, required: true }, // URL di R2 /raw
  sourceImageKey: { type: String, required: true }, // Key di R2 /raw
  outputImageURL: { type: String }, // URL hasil processing
  outputImageKey: { type: String }, // Key hasil processing
  status: { 
    type: String, 
    enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"], // UPPERCASE untuk worker
    default: "PENDING" 
  },
  errorMsg: { type: String, default: "" },
  originalFilename: { type: String },
  mimetype: { type: String },
  fileSize: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

// Index for querying by entity
ImageJobSchema.index({ entityType: 1, entityId: 1 });
ImageJobSchema.index({ status: 1 });

export default mongoose.model("ImageJob", ImageJobSchema, "image_jobs");

