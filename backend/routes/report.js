import express from "express";
import * as reportController from "../controllers/report.js";
// import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", reportController.getAllReports);
router.get("/stats", reportController.getReportStats);
router.get("/:id", reportController.getReportById);
router.post("/", reportController.createReport);
router.post("/enqueue", reportController.createAndEnqueueReport); // Create + Enqueue
router.post("/:id/enqueue", reportController.enqueueReportJob); // Enqueue existing report
router.put("/:id", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

export default router;
