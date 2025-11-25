import express from "express";
import * as reportController from "../controllers/report.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", reportController.getAllReports);
router.get("/stats", reportController.getReportStats);
router.get("/:id", reportController.getReportById);
router.post("/", authenticate, reportController.createReport);
router.post("/enqueue", authenticate, reportController.createAndEnqueueReport); // Create + Enqueue
router.post("/:id/enqueue", authenticate, reportController.enqueueReportJob); // Enqueue existing report
router.put("/:id", authenticate, reportController.updateReport);
router.delete("/:id", authenticate, reportController.deleteReport);

export default router;
