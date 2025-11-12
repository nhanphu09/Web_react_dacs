import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js"; // 🟢 SỬA: Đảm bảo đường dẫn đúng
import { errorHandler } from "./middleware/errorHandler.js"; // 🟢 SỬA: Đảm bảo đường dẫn đúng
import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { createAdminIfMissing } from "./utils/seedAdmin.js"; // 🟢 SỬA: Đảm bảo đường dẫn đúng

dotenv.config();
const app = express();

// 🟢 BƯỚC QUAN TRỌNG: Cấu hình CORS
// Phải nằm TRƯỚC tất cả các app.use("/api/...")
app.use(
	cors({
		origin: "http://localhost:5173", // Cho phép frontend 5173 gọi
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.use(express.json());

app.get("/", (req, res) => res.send("✅ Backend is running!"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reports", reportRoutes);

// Xử lý lỗi
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 5000;
(async () => {
	try {
		await connectDB();
		await createAdminIfMissing();
		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
	} catch (error) {
		console.error("Failed to start server:", error.message);
	}
})();
