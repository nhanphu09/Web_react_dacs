import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js"; // 🟢 THÊM
import User from "../models/User.js";

const router = express.Router();

// 🟢 SỬA: Chỉ admin mới được xem tất cả user
router.get("/", protect, adminOnly, async (req, res) => {
	const users = await User.find().select("-password");
	res.json(users);
});

// 🟢 THÊM: API Khóa người dùng
router.put("/:id/lock", protect, adminOnly, async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ locked: true },
			{ new: true }
		);
		res.json(user);
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
});

// 🟢 THÊM: API Mở khóa người dùng
router.put("/:id/unlock", protect, adminOnly, async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ locked: false },
			{ new: true }
		);
		res.json(user);
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
});

export default router;
