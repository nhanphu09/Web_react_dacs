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

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

router.get("/", protect, adminOnly, getOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.get("/:id", protect, adminOnly, getOrderById);

export default router;
