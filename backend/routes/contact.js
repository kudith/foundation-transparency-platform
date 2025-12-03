import express from "express";
import { submitContact } from "../controllers/contact.js";

const router = express.Router();

// POST /api/contact - Submit contact form
router.post("/", submitContact);

export default router;

