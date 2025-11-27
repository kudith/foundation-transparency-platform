import mongoose from "mongoose";

const TutorSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Internal", "External"], required: true },
    userID: { type: String },
    name: { type: String, required: true },
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  community: { type: String, required: true },
  date: { type: Date, required: true },
  tutor: { type: TutorSchema, required: true },
  imageJobIds: { type: [String], default: [] }, // Reference to image_jobs collection
  description: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Event", EventSchema);
