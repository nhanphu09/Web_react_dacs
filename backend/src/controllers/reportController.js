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

export const getChartData = async (req, res) => {
	try {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
		sevenDaysAgo.setHours(0, 0, 0, 0);

		const salesData = await Order.aggregate([
			{
				$match: {
					createdAt: { $gte: sevenDaysAgo },
					status: "Delivered",
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					totalSales: { $sum: "$totalPrice" },
				},
			},
		]);

		const salesMap = new Map();
		salesData.forEach((item) => {
			salesMap.set(item._id, item.totalSales);
		});

		const formattedData = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(sevenDaysAgo);
			date.setDate(date.getDate() + i);

			const dateString = date.toISOString().split("T")[0];

			formattedData.push({
				date: dateString,
				sales: salesMap.get(dateString) || 0,
			});
		}

		res.json(formattedData);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
