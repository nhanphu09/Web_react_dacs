import express from "express";
import {
	createProduct, // Sẽ thêm ở bước 2
	createProductReview,
	deleteProduct,
	getProductById, // Sẽ thêm ở bước 4
	getProductReviews,
	getProducts,
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts); // 🟢 ĐÃ SỬA: Gọi controller
router.post("/", protect, adminOnly, createProduct); // 🟢 ĐÃ SỬA: Gọi controller

router.get("/:id", getProductById); // 🟢 ĐÃ THÊM: Cho trang chi tiết

// 🟢 ĐÃ THÊM: Cho trang đánh giá
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", protect, createProductReview);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
