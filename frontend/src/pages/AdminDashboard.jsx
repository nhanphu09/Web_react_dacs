import {
	BarChart2,
	DollarSign,
	Package,
	ShoppingBag,
	TrendingUp,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

// Helper định dạng tiền
const formatCurrency = (amount) => {
	return (amount || 0).toLocaleString("vi-VN", {
		style: "currency",
		currency: "VND",
	});
};

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		revenueToday: 0,
		revenueMonth: 0,
		bestSellers: [],
	});
	const [recentOrders, setRecentOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// Tải cả hai API cùng lúc
				const [statsRes, ordersRes] = await Promise.all([
					api.get("/reports"),
					api.get("/orders?limit=5&sort=createdAt_desc"), // Tải 5 đơn hàng mới nhất
				]);
				setStats(statsRes.data);
				setRecentOrders(ordersRes.data.orders);
			} catch (err) {
				console.error("Failed to fetch dashboard data", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
				<BarChart2 className="text-primary" size={30} />
				Tổng quan
			</h2>

			{/* Thẻ thống kê doanh thu (Giữ nguyên) */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
					<div className="flex items-center justify-between">
						<h3 className="text-gray-600 font-medium">Doanh thu hôm nay</h3>
						<DollarSign className="text-green-600" />
					</div>
					<p className="text-3xl font-bold text-green-700 mt-3">
						{formatCurrency(stats.revenueToday)}
					</p>
				</div>
				<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
					<div className="flex items-center justify-between">
						<h3 className="text-gray-600 font-medium">Doanh thu tháng này</h3>
						<ShoppingBag className="text-blue-600" />
					</div>
					<p className="text-3xl font-bold text-blue-700 mt-3">
						{formatCurrency(stats.revenueMonth)}
					</p>
				</div>
				<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
					<div className="flex items-center justify-between">
						<h3 className="text-gray-600 font-medium">Sản phẩm bán chạy</h3>
						<TrendingUp className="text-orange-500" />
					</div>
					<p className="text-3xl font-bold text-orange-600 mt-3">
						{stats.bestSellers.length}
					</p>
				</div>
			</div>

			{/* Lối tắt quản lý */}
			<div className="mt-10">
				<h3 className="text-2xl font-semibold mb-4 text-gray-800">
					Lối tắt quản lý
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Link
						to="/admin/products"
						className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center transform hover:-translate-y-1">
						<Package size={32} className="mx-auto text-primary" />
						<p className="mt-2 font-semibold text-gray-700">Sản phẩm</p>
					</Link>
					<Link
						to="/admin/orders"
						className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center transform hover:-translate-y-1">
						<ShoppingBag size={32} className="mx-auto text-blue-600" />
						<p className="mt-2 font-semibold text-gray-700">Đơn hàng</p>
					</Link>
					<Link
						to="/admin/users"
						className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center transform hover:-translate-y-1">
						<Users size={32} className="mx-auto text-green-600" />
						<p className="mt-2 font-semibold text-gray-700">Người dùng</p>
					</Link>
					<Link
						to="/admin/reports"
						className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center transform hover:-translate-y-1">
						<BarChart2 size={32} className="mx-auto text-orange-500" />
						<p className="mt-2 font-semibold text-gray-700">Báo cáo</p>
					</Link>
				</div>
			</div>

			{/* Bố cục 2 cột cho Bảng */}
			<div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Cột 1: Sản phẩm bán chạy */}
				<div>
					<h3 className="text-2xl font-semibold mb-4 text-gray-800">
						🔥 Sản phẩm bán chạy
					</h3>
					<div className="bg-white rounded-xl shadow overflow-hidden">
						<table className="w-full border-collapse">
							<thead className="bg-gray-100 text-gray-700">
								<tr>
									<th className="py-3 px-4 text-left">Tên sản phẩm</th>
									<th className="py-3 px-4 text-right">Số lượt bán</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td colSpan="2" className="text-center p-4">
											Đang tải...
										</td>
									</tr>
								) : stats.bestSellers.length === 0 ? (
									<tr>
										<td
											colSpan="2"
											className="text-center py-6 text-gray-500 italic">
											Chưa có dữ liệu
										</td>
									</tr>
								) : (
									stats.bestSellers.map((p, i) => (
										<tr
											key={i}
											className="border-t hover:bg-gray-50 transition">
											<td className="py-3 px-4 font-medium text-gray-800">
												{p.title}
											</td>
											<td className="py-3 px-4 text-right text-gray-700">
												{p.sold}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Cột 2 - Đơn hàng mới nhất */}
				<div>
					<h3 className="text-2xl font-semibold mb-4 text-gray-800">
						🧾 Đơn hàng mới nhất
					</h3>
					<div className="bg-white rounded-xl shadow overflow-hidden">
						<table className="w-full border-collapse">
							<thead className="bg-gray-100 text-gray-700">
								<tr>
									<th className="py-3 px-4 text-left">Khách hàng</th>
									<th className="py-3 px-4 text-left">Trạng thái</th>
									<th className="py-3 px-4 text-right">Tổng tiền</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td colSpan="3" className="text-center p-4">
											Đang tải...
										</td>
									</tr>
								) : recentOrders.length === 0 ? (
									<tr>
										<td
											colSpan="3"
											className="text-center py-6 text-gray-500 italic">
											Chưa có đơn hàng nào
										</td>
									</tr>
								) : (
									recentOrders.map((order) => (
										<tr
											key={order._id}
											className="border-t hover:bg-gray-50 transition">
											<td className="py-3 px-4 font-medium text-gray-800">
												{order.user?.name || "Khách"}
											</td>
											<td className="py-3 px-4 text-gray-700">
												{order.status}
											</td>
											<td className="py-3 px-4 text-right text-primary font-semibold">
												{formatCurrency(order.totalPrice)}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
