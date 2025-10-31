import express from "express";
import {
	createProduct,
	createProductReview,
	deleteProduct,
	getProductById,
	getProductReviews,
	getProducts,
	updateProduct,
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, adminOnly, createProduct);

router.get("/:id", getProductById);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.put("/:id", protect, adminOnly, updateProduct);

router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", protect, createProductReview);

export default router;
