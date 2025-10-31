import express from "express";
import {
	createBrand,
	deleteBrand,
	getBrands,
	updateBrand,
} from "../controllers/brandController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBrands);
router.post("/", protect, adminOnly, createBrand);
router.put("/:id", protect, adminOnly, updateBrand);
router.delete("/:id", protect, adminOnly, deleteBrand);

export default router;
