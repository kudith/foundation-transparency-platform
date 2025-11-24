import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteEventImage,
} from "../controllers/event.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Protected routes (require authentication)
router.post("/", authenticate, upload.array("images", 5), createEvent);
router.put("/:id", authenticate, upload.array("images", 5), updateEvent);
router.delete("/:id", authenticate, deleteEvent);
router.delete("/:id/images/:publicId", authenticate, deleteEventImage);

export default router;
