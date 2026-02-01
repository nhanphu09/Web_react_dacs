import express from "express";
import {
    createCoupon,
    deleteCoupon,
    getCoupons,
    validateCoupon,
} from "../controllers/couponController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route cho Admin quản lý
router.get("/", protect, adminOnly, getCoupons);
router.post("/", protect, adminOnly, createCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

// Route cho Khách hàng check mã
router.post("/validate", validateCoupon); // Không cần protect để khách vãng lai cũng check được

export default router;