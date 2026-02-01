import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Users, ShoppingBag, DollarSign, Package, TrendingUp } from "lucide-react";
import api from "../api/client";

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalOrders: 0,
		totalRevenue: 0,
		totalProducts: 0,
		recentOrders: [],
		chartData: []
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const { data } = await api.get("/stats");
				setStats(data);
			} catch (error) {
				console.error("Lỗi lấy thống kê:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

	// Format tiền Việt
	const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + " đ";

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>

			{/* 1. CÁC THẺ CARD THỐNG KÊ */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Doanh thu"
					value={formatCurrency(stats.totalRevenue)}
					icon={<DollarSign size={24} />}
					color="bg-green-500"
				/>
				<StatCard
					title="Đơn hàng"
					value={stats.totalOrders}
					icon={<ShoppingBag size={24} />}
					color="bg-blue-500"
				/>
				<StatCard
					title="Khách hàng"
					value={stats.totalUsers}
					icon={<Users size={24} />}
					color="bg-purple-500"
				/>
				<StatCard
					title="Sản phẩm"
					value={stats.totalProducts}
					icon={<Package size={24} />}
					color="bg-orange-500"
				/>
			</div>

			{/* 2. BIỂU ĐỒ & ĐƠN HÀNG MỚI */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

				{/* Biểu đồ doanh thu */}
				<div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
						<TrendingUp size={20} className="text-primary" /> Biểu đồ doanh thu (7 ngày qua)
					</h3>
					<div className="h-80 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={stats.chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="_id" />
								<YAxis />
								<Tooltip formatter={(value) => formatCurrency(value)} />
								<Legend />
								<Bar dataKey="sales" name="Doanh thu" fill="#3B82F6" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Danh sách đơn mới */}
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-bold mb-4">Đơn hàng vừa đặt</h3>
					<div className="space-y-4">
						{stats.recentOrders.length === 0 ? (
							<p className="text-gray-500 text-sm">Chưa có đơn hàng nào.</p>
						) : (
							stats.recentOrders.map((order) => (
								<div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
									<div>
										<p className="font-bold text-sm text-gray-800">{order.user?.name || "Khách lẻ"}</p>
										<p className="text-xs text-gray-500">Mã: #{order._id.slice(-6).toUpperCase()}</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-primary text-sm">{formatCurrency(order.totalPrice)}</p>
										<span className={`text-[10px] px-2 py-1 rounded-full ${order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
											}`}>
											{order.isPaid ? "Đã TT" : "Chờ TT"}
										</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Component con hiển thị Card
function StatCard({ title, value, icon, color }) {
	return (
		<div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 hover:shadow-md transition">
			<div className={`${color} text-white p-4 rounded-full shadow-lg`}>
				{icon}
			</div>
			<div>
				<p className="text-gray-500 text-sm">{title}</p>
				<h3 className="text-2xl font-bold text-gray-800">{value}</h3>
			</div>
		</div>
	);
}