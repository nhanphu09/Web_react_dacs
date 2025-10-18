import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { createAdminIfMissing } from "./utils/seedAdmin.js";

dotenv.config();
const app = express();

// ✅ Cấu hình CORS đúng thứ tự
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
	cors({
		origin: allowedOrigin,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

// ✅ Đảm bảo preflight OPTIONS cũng được xử lý
// app.options(
// 	"/*",
// 	cors({
// 		origin: allowedOrigin,
// 		credentials: true,
// 	})
// );

app.use(express.json());

app.get("/", (req, res) => res.send("✅ Backend is running!"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
(async () => {
	await connectDB();
	await createAdminIfMissing();
	app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
