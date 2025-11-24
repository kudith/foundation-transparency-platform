import express from "express";
import * as userController from "../controllers/admin.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes - require authentication
router.post("/", userController.create);
router.get("/", authenticate, userController.getAll);
router.get("/:id", authenticate, userController.getById);
router.put("/:id", authenticate, userController.update);
router.delete("/:id", authenticate, userController.remove);

export default router;
