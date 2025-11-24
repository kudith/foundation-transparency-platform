import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getAllAttendances,
  getAttendanceById,
  getAttendancesByEventId,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendance.js";

const router = express.Router();

router.get("/", getAllAttendances);
router.get("/:id", getAttendanceById);
router.get("/event/:eventId", getAttendancesByEventId);
router.post("/", createAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

export default router;
