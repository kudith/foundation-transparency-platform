import mongoose from "mongoose";

const AttendeeSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Member", "Guest"], required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
  },
  { _id: false }
);

const AttendanceSchema = new mongoose.Schema({
  eventID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event",
    required: true 
  },
  attendee: { type: AttendeeSchema, required: true },
});

export default mongoose.model("Attendance", AttendanceSchema);
