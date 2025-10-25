import express from "express";
import { getStats } from "../controllers/reportController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 THÊM: Chỉ Admin mới được xem báo cáo
router.get("/", protect, adminOnly, getStats);

export default router;
