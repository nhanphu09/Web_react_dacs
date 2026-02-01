import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Đếm số liệu tổng quan
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});

        // Tính tổng doanh thu (chỉ tính đơn đã thanh toán hoặc đã giao)
        // Ở đây tạm tính tất cả đơn để test cho sướng mắt
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        // 2. Lấy 5 đơn hàng mới nhất
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        // 3. Chuẩn bị dữ liệu biểu đồ (Doanh thu 7 ngày gần nhất)
        // Phần này xử lý hơi phức tạp chút để nhóm theo ngày
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyOrders = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            recentOrders,
            chartData: dailyOrders
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};