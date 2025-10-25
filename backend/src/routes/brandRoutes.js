import express from "express";
import { createBrand, getBrands } from "../controllers/brandController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBrands); // Lấy tất cả thương hiệu
router.post("/", protect, adminOnly, createBrand); // Admin tạo thương hiệu

export default router;
