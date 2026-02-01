import express from "express";
import upload from "../config/cloudinary.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route: POST /api/upload
// Chỉ Admin mới được upload
router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
    try {
        // Trả về đường dẫn ảnh online
        res.json({ url: req.file.path });
    } catch (error) {
        res.status(500).json({ message: "Lỗi upload ảnh" });
    }
});

export default router;