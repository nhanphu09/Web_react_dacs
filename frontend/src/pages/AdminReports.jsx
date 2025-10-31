import { BarChart2, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";

// 🟢 SỬA: Component biểu đồ (Phiên bản "chỉnh chu" hơn)
const SimpleBarChart = ({ data, loading }) => {
	if (loading) {
		return (
			<div className="text-center p-10 h-80 flex items-center justify-center bg-gray-50 border rounded-lg">
				Đang tải dữ liệu biểu đồ...
			</div>
		);
	}
	if (!data || data.length === 0) {
		return (
			<div className="text-center p-10 h-80 flex items-center justify-center bg-gray-50 border rounded-lg">
				Không có dữ liệu 7 ngày qua.
			</div>
		);
	}

	const maxSale = Math.max(...data.map((d) => d.sales));
	// Tránh chia cho 0
	const max = maxSale === 0 ? 1 : maxSale;

	return (
		<div className="w-full h-80 bg-white p-6 rounded-lg flex items-end justify-around gap-2 border">
			{data.map((item) => (
				<div
					key={item.date}
					className="flex-1 flex flex-col items-center justify-end h-full">
					{/* Giá trị trên cột */}
					<span className="text-xs font-bold text-primary mb-1">
						{/* Hiển thị '100k' hoặc '0' */}
						{item.sales > 0 ? (item.sales / 1000).toFixed(0) + "k" : ""}
					</span>

					{/* Cột biểu đồ */}
					<div
						className="w-3/4 bg-primary hover:bg-secondary transition-all rounded-t"
						style={{
							// Chiều cao tối thiểu 1px ngay cả khi = 0
							height: `${Math.max((item.sales / max) * 100, 0.5)}%`,
						}}
						title={`${item.sales.toLocaleString("vi-VN")} đ`}
					/>
					{/* Nhãn ngày */}
					<span className="text-xs font-medium text-gray-600 mt-2">
						{new Date(item.date).toLocaleDateString("vi-VN", {
							day: "2-digit",
							month: "2-digit",
						})}
					</span>
				</div>
			))}
		</div>
	);
};

export default function AdminReports() {
	const [stats, setStats] = useState({
		revenueToday: 0,
		revenueMonth: 0,
	});
	const [chartData, setChartData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [statsRes, chartRes] = await Promise.all([
					api.get("/reports"),
					api.get("/reports/charts"),
				]);
				setStats(statsRes.data);
				setChartData(chartRes.data);
			} catch (err) {
				console.error("Failed to fetch reports", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const formatCurrency = (amount) => {
		return (amount || 0).toLocaleString("vi-VN", {
			style: "currency",
			currency: "VND",
		});
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
				<TrendingUp className="text-primary" size={30} />
				Thống kê & Báo cáo
			</h2>

			{/* Thẻ thống kê */}
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
						<DollarSign className="text-blue-600" />
					</div>
					<p className="text-3xl font-bold text-blue-700 mt-3">
						{formatCurrency(stats.revenueMonth)}
					</p>
				</div>
			</div>

			{/* KHU VỰC BIỂU ĐỒ */}
			<div className="mt-10">
				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
						<BarChart2 />
						Doanh thu 7 ngày qua (Chỉ tính đơn đã giao)
					</h3>
					<SimpleBarChart data={chartData} loading={loading} />
				</div>
			</div>
		</div>
	);
}
