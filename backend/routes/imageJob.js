import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getImageJobById,
  getImageJobsByEntity,
  updateImageJobStatus,
  retryImageJob,
  deleteImageJob,
} from "../controllers/imageJob.js";

const router = express.Router();

// Get single image job
router.get("/:id", authenticate, getImageJobById);

// Get image jobs by entity
router.get("/", authenticate, getImageJobsByEntity);

// Update job status (webhook from worker) - no auth for worker callbacks
// In production, you should use a secret token or IP whitelist
router.patch("/:id/status", updateImageJobStatus);

// Retry failed job
router.post("/:id/retry", authenticate, retryImageJob);

// Delete image job
router.delete("/:id", authenticate, deleteImageJob);

export default router;









