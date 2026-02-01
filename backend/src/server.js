import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Import Models
import Brand from "./models/Brand.js";
import Category from "./models/Category.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { createAdminIfMissing } from "./utils/seedAdmin.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

dotenv.config();
const app = express();

// 🟢 CẤU HÌNH CORS CHUẨN (Thay thế toàn bộ đoạn thủ công cũ)
const corsOptions = {
	origin: [
		process.env.FRONTEND_URL,       // URL trên Vercel (nếu có trong .env)
		"http://localhost:5173",        // Localhost thường
		"http://127.0.0.1:5173",        // Localhost IP
	].filter(Boolean),                  // Lọc bỏ giá trị null/undefined
	credentials: true,                  // Cho phép cookie/token
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Body Parser
app.use(express.json());

app.get("/", (req, res) => res.send("✅ Backend is running!"));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/coupons", couponRoutes);

// Xử lý lỗi
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

// KHỞI ĐỘNG SERVER
const PORT = process.env.PORT || 5000;
(async () => {
	try {
		if (process.env.GEMINI_API_KEY) {
			console.log("✅ Chatbot API Key loaded.");
		} else {
			console.warn("⚠️ Chatbot API Key missing in .env");
		}

		await connectDB();
		await createAdminIfMissing();

		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
	} catch (error) {
		console.error("Failed to start server:", error.message);
	}
})();