import mongoose from "mongoose";

const TutorSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Internal", "External"], required: true },
    userID: { type: String },
    name: { type: String, required: true },
  },
  { _id: false }
);

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  community: { type: String, required: true },
  date: { type: Date, required: true },
  tutor: { type: TutorSchema, required: true },
  images: { type: [ImageSchema], default: [] },
  description: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Event", EventSchema);
