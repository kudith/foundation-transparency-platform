import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationStats,
} from "../controllers/donation.js";

const router = express.Router();

router.get("/", getAllDonations);
router.get("/stats", getDonationStats);
router.get("/:id", getDonationById);
router.post("/", authenticate, createDonation);
router.put("/:id", authenticate, updateDonation);
router.delete("/:id", authenticate, deleteDonation);

export default router;
