import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Helper lấy ngày bắt đầu của hôm nay
const getTodayStartDate = () => {
	return new Date(new Date().setHours(0, 0, 0, 0));
};

// Helper lấy ngày bắt đầu của tháng này
const getMonthStartDate = () => {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const getStats = async (req, res) => {
	try {
		const today = getTodayStartDate();
		const startOfMonth = getMonthStartDate();

		// 1. Tính doanh thu hôm nay
		const todayRevenueAgg = await Order.aggregate([
			{ $match: { createdAt: { $gte: today }, status: "Delivered" } },
			{ $group: { _id: null, total: { $sum: "$totalPrice" } } },
		]);
		const revenueToday =
			todayRevenueAgg.length > 0 ? todayRevenueAgg[0].total : 0;

		// 2. Tính doanh thu tháng này
		const monthRevenueAgg = await Order.aggregate([
			{ $match: { createdAt: { $gte: startOfMonth }, status: "Delivered" } },
			{ $group: { _id: null, total: { $sum: "$totalPrice" } } },
		]);
		const revenueMonth =
			monthRevenueAgg.length > 0 ? monthRevenueAgg[0].total : 0;

		const bestSellers = await Product.find()
			.sort({ sold: -1 }) // Sắp xếp theo 'sold' giảm dần
			.limit(5)
			.select("title sold"); // Chọn trường 'sold' thật

		res.json({
			revenueToday,
			revenueMonth,
			bestSellers: bestSellers, // 🟢 SỬA: Dùng biến thật
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
