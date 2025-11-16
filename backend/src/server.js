import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js"; // (Đường dẫn của bạn)
import { errorHandler } from "./middleware/errorHandler.js"; // (Đường dẫn của bạn)
import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { createAdminIfMissing } from "./utils/seedAdmin.js"; // (Đường dẫn của bạn)

dotenv.config();
const app = express();

// 🟢 BẮT ĐẦU SỬA: Cấu hình CORS động
const allowedOrigins = [
	process.env.FRONTEND_URL, // Đây sẽ là URL Vercel (sẽ thêm ở bước deploy)
	"http://localhost:5173", // URL phát triển ở máy
];

app.use(
	cors({
		origin: function (origin, callback) {
			// Cho phép nếu origin nằm trong 'allowedOrigins' (hoặc nếu là 'undefined' - ví dụ: Postman)
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error("Bị chặn bởi CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);
// 🟢 KẾT THÚC SỬA

app.use(express.json());

app.get("/", (req, res) => res.send("✅ Backend is running!"));

// Routes (Giữ nguyên)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reports", reportRoutes);

// Xử lý lỗi (Giữ nguyên)
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

// Khởi động server (Giữ nguyên)
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
