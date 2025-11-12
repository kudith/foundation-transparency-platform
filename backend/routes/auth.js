import express from "express";
import * as authController from "../controllers/auth.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.get("/me", authenticate, authController.me);
router.post("/logout", authController.logout);

export default router;
