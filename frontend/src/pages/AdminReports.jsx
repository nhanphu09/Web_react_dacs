import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminReports() {
	const [stats, setStats] = useState({
		revenueToday: 0,
		revenueMonth: 0,
		bestSellers: [],
	});

	useEffect(() => {
		api.get("/admin/reports").then((res) => setStats(res.data));
	}, []);

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
				<TrendingUp className="text-primary" size={30} />
				Thống kê & Báo cáo
			</h2>

			{/* Thẻ thống kê doanh thu */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
					<div className="flex items-center justify-between">
						<h3 className="text-gray-600 font-medium">Doanh thu hôm nay</h3>
						<DollarSign className="text-green-600" />
					</div>
					<p className="text-3xl font-bold text-green-700 mt-3">
						{stats.revenueToday.toLocaleString()} đ
					</p>
				</div>

				<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
					<div className="flex items-center justify-between">
						<h3 className="text-gray-600 font-medium">Doanh thu tháng này</h3>
						<ShoppingBag className="text-blue-600" />
					</div>
					<p className="text-3xl font-bold text-blue-700 mt-3">
						{stats.revenueMonth.toLocaleString()} đ
					</p>
				</div>

				<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
					<div className="flex items-center justify-between">
						<h3 className="text-gray-600 font-medium">
							Tổng sản phẩm bán chạy
						</h3>
						<TrendingUp className="text-orange-500" />
					</div>
					<p className="text-3xl font-bold text-orange-600 mt-3">
						{stats.bestSellers.length}
					</p>
				</div>
			</div>

			{/* Bảng sản phẩm bán chạy */}
			<div className="mt-10">
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
							{stats.bestSellers.length === 0 ? (
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
										key={p._id}
										className={`border-t hover:bg-gray-50 transition ${
											i % 2 === 0 ? "bg-white" : "bg-gray-50"
										}`}>
										<td className="py-3 px-4 font-medium text-gray-800">
											{p.name}
										</td>
										<td className="py-3 px-4 text-right text-gray-700">
											{p.sold} lượt
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
