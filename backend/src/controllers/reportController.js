import Order from "../models/Order.js";
import Product from "../models/Product.js";

const getTodayStartDate = () => {
	return new Date(new Date().setHours(0, 0, 0, 0));
};

const getMonthStartDate = () => {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const getStats = async (req, res) => {
	try {
		const today = getTodayStartDate();
		const startOfMonth = getMonthStartDate();

		const todayRevenueAgg = await Order.aggregate([
			{ $match: { createdAt: { $gte: today }, status: "Delivered" } },
			{ $group: { _id: null, total: { $sum: "$totalPrice" } } },
		]);
		const revenueToday =
			todayRevenueAgg.length > 0 ? todayRevenueAgg[0].total : 0;

		const monthRevenueAgg = await Order.aggregate([
			{ $match: { createdAt: { $gte: startOfMonth }, status: "Delivered" } },
			{ $group: { _id: null, total: { $sum: "$totalPrice" } } },
		]);
		const revenueMonth =
			monthRevenueAgg.length > 0 ? monthRevenueAgg[0].total : 0;

		const bestSellers = await Product.find()
			.sort({ sold: -1 })
			.limit(5)
			.select("title sold");

		res.json({
			revenueToday,
			revenueMonth,
			bestSellers: bestSellers,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
