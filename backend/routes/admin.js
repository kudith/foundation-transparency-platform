import express from "express";
import * as userController from "../controllers/admin.js";
import { authenticate, isSuperAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes - require authentication
// Only super_admin can create new admin users
router.post("/", authenticate, isSuperAdmin, userController.create);

// All authenticated admins can view users
router.get("/", authenticate, userController.getAll);
router.get("/:id", authenticate, userController.getById);

// All authenticated admins can update (role change is checked in service)
router.put("/:id", authenticate, userController.update);

// Only super_admin can delete admin users
router.delete("/:id", authenticate, isSuperAdmin, userController.remove);

export default router;
