import express from "express";
import { getUsers, updateUserProfile } from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.put("/profile", protect, updateUserProfile);

router.get("/", protect, adminOnly, getUsers);

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
