import express from "express";
import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";
import userRoutes from "./user.js";
import eventRoutes from "./event.js";
import attendanceRoutes from "./attendance.js";
import donationRoutes from "./donation.js";
import reportRoutes from "./report.js";
import expenseRoutes from "./expense.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/attendances", attendanceRoutes);
router.use("/donations", donationRoutes);
router.use("/expenses", expenseRoutes);
router.use("/reports", reportRoutes);

export default router;
