import express from "express";
import {
	createOrder,
	getMyOrders,
	getOrders, // Sẽ thêm ở bước 4
	updateOrderStatus, // Sẽ thêm ở bước 5
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 ĐÃ SỬA: Người dùng tạo đơn hàng
router.post("/", protect, createOrder);

// 🟢 ĐÃ THÊM: Người dùng xem đơn hàng CỦA HỌ
router.get("/my-orders", protect, getMyOrders);

// 🟢 ĐÃ THÊM: Admin xem TẤT CẢ đơn hàng
router.get("/", protect, adminOnly, getOrders);

// 🟢 ĐÃ THÊM: Admin cập nhật trạng thái
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
