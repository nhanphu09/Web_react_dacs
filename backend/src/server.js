import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// BẮT BUỘC: Import tất cả các Models để Mongoose tải chúng
import Brand from "./models/Brand.js";
import Category from "./models/Category.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { createAdminIfMissing } from "./utils/seedAdmin.js";

dotenv.config();
const app = express();

// 🟢 1. MIDDLEWARE: Xử lý CORS THỦ CÔNG & OPTIONS (FIX CỨNG)
app.use((req, res, next) => {
	const allowedOrigins = [
		process.env.FRONTEND_URL,
		"http://localhost:5173", // Frontend dev URL
	];

	const origin = req.headers.origin;
	if (origin && allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	} else {
		// Cho phép Postman (không có origin)
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	}

	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// Xử lý yêu cầu OPTIONS (Preflight)
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}

	next();
});

// 2. Body Parser
app.use(express.json());

// 3. Sử dụng CORS Middleware
const corsOptions = { credentials: true };
app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("✅ Backend is running!"));

// 4. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);

// Xử lý lỗi (Giữ nguyên)
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

// KHỞI ĐỘNG SERVER
const PORT = process.env.PORT || 5000;
(async () => {
	try {
		// 1. Kiểm tra Key
		if (process.env.GEMINI_API_KEY) {
			console.log(
				"✅ Chatbot API Key loaded successfully. (Length:",
				process.env.GEMINI_API_KEY.length,
				")"
			);
		} else {
			console.error(
				"❌ Chatbot API Key NOT found in environment variables. CHECK .env FILE!"
			);
		}

		// 2. Kết nối DB
		await connectDB();
		await createAdminIfMissing();

		// 3. Khởi động Server
		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
	} catch (error) {
		console.error("Failed to start server:", error.message);
	}
})();
