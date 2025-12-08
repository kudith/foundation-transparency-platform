import express from "express";
import * as milestoneController from "../controllers/milestone.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", milestoneController.getAll);
router.get("/stats", milestoneController.getStats);
router.get("/user/:userID", milestoneController.getByUserId);
router.get("/:id", milestoneController.getById);

// Protected routes - require authentication
router.post("/", authenticate, milestoneController.create);
router.put("/:id", authenticate, milestoneController.update);
router.delete("/:id", authenticate, milestoneController.remove);

export default router;



