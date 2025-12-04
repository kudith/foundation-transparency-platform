import express from "express";
import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";
import userRoutes from "./user.js";
import eventRoutes from "./event.js";
import attendanceRoutes from "./attendance.js";
import donationRoutes from "./donation.js";
import reportRoutes from "./report.js";
import expenseRoutes from "./expense.js";
import imageJobRoutes from "./imageJob.js";
import contactRoutes from "./contact.js";
import milestoneRoutes from "./milestone.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/admins", adminRoutes); // Alias for admin management (plural form)
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/attendances", attendanceRoutes);
router.use("/donations", donationRoutes);
router.use("/expenses", expenseRoutes);
router.use("/reports", reportRoutes);
router.use("/image-jobs", imageJobRoutes);
router.use("/contact", contactRoutes);
router.use("/milestones", milestoneRoutes);

export default router;
