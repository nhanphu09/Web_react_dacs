import express from "express";
import {
	createOrder,
	getMyOrders,
	getOrderById,
	getOrders,
	updateOrderStatus,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- NHÓM ROUTE CHO NGƯỜI DÙNG (VÀ ADMIN) ---

// Tạo đơn hàng
router.post("/", protect, createOrder);

// Lấy danh sách đơn hàng của tôi
router.get("/my-orders", protect, getMyOrders);

// Lấy chi tiết 1 đơn hàng (Dùng cho trang Payment QR)
// ⚠️ QUAN TRỌNG: Bỏ 'adminOnly' ở đây để khách hàng có thể xem đơn của họ
router.get("/:id", protect, getOrderById);


// --- NHÓM ROUTE CHỈ DÀNH CHO ADMIN ---

// Lấy tất cả đơn hàng (Quản lý)
router.get("/", protect, adminOnly, getOrders);

// Cập nhật trạng thái (Duyệt đơn/Giao hàng)
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;