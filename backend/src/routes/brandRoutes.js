import express from "express";
import { createBrand, getBrands } from "../controllers/brandController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBrands);
router.post("/", protect, adminOnly, createBrand);

export default router;
