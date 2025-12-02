import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.js";

const router = express.Router();

// Public routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// Protected routes (require authentication)
router.post("/", authenticate, createUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;
