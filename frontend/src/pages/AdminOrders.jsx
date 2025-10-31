import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

export default function AdminOrders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				// 🟢 SỬA: Sắp xếp theo đơn hàng mới nhất
				const res = await api.get("/orders?sort=createdAt_desc");
				setOrders(res.data);
			} catch (error) {
				console.error("Failed to fetch orders", error);
			}
		};
		fetchOrders();
	}, []);

	// 🟢 SỬA: Hàm cập nhật trạng thái (gọi từ dropdown)
	const updateStatus = async (id, status) => {
		try {
			await api.put(`/orders/${id}/status`, { status });
			setOrders((prev) =>
				prev.map((o) => (o._id === id ? { ...o, status } : o))
			);
			toast.success("Cập nhật trạng thái thành công!");
		} catch (error) {
			toast.warn("Cập nhật trạng thái thất bại!");
		}
	};

	// 🟢 SỬA: Hàm định dạng tiền
	const formatCurrency = (amount) => {
		return (amount || 0).toLocaleString("vi-VN", {
			style: "currency",
			currency: "VND",
		});
	};

	// 🟢 SỬA: Hàm hiển thị badge (nhỏ gọn hơn)
	const statusBadge = (status) => {
		switch (status) {
			case "Processing":
				return (
					<span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full font-semibold">
						Đang xử lý
					</span>
				);
			case "Shipped":
				return (
					<span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full font-semibold">
						Đã gửi hàng
					</span>
				);
			case "Delivered":
				return (
					<span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full font-semibold">
						Đã giao
					</span>
				);
			case "Cancelled":
				return (
					<span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full font-semibold">
						Đã hủy
					</span>
				);
			default:
				return (
					<span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full font-semibold">
						Chờ xử lý
					</span>
				);
		}
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
				<Package className="text-primary" /> Quản lý đơn hàng
			</h2>

			{/* 🟢 SỬA: Chuyển sang BẢNG (TABLE) */}
			<div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
				{orders.length === 0 ? (
					<p className="text-gray-600 text-center py-10">
						Không có đơn hàng nào.
					</p>
				) : (
					<table className="w-full min-w-[800px]">
						<thead className="bg-gray-100 text-left text-gray-700">
							<tr>
								<th className="py-3 px-4">Mã đơn</th>
								<th className="py-3 px-4">Ngày đặt</th>
								<th className="py-3 px-4">Khách hàng</th>
								<th className="py-3 px-4">Sản phẩm</th>
								<th className="py-3 px-4">Tổng tiền</th>
								<th className="py-3 px-4">Trạng thái</th>
								<th className="py-3 px-4">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr
									key={order._id}
									className="border-b hover:bg-gray-50 transition">
									{/* Mã đơn */}
									<td className="py-3 px-4 text-sm font-mono text-gray-600">
										{order._id.substring(0, 8)}...
									</td>
									{/* Ngày đặt */}
									<td className="py-3 px-4 text-sm text-gray-700">
										{new Date(order.createdAt).toLocaleDateString("vi-VN")}
									</td>
									{/* Khách hàng */}
									<td className="py-3 px-4 font-medium text-gray-800">
										{order.user?.name || "Không rõ"}
									</td>
									{/* Sản phẩm */}
									<td className="py-3 px-4 text-sm text-gray-700">
										{order.products
											.map((p) => p.product?.title || "[Bị xóa]")
											.join(", ")}
									</td>
									{/* Tổng tiền */}
									<td className="py-3 px-4 font-semibold text-primary">
										{formatCurrency(order.totalPrice)}
									</td>
									{/* Trạng thái (Badge) */}
									<td className="py-3 px-4">{statusBadge(order.status)}</td>
									{/* Hành động (Dropdown) */}
									<td className="py-3 px-4">
										<select
											value={order.status}
											onChange={(e) => updateStatus(order._id, e.target.value)}
											className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white">
											<option value="Pending">Chờ xử lý</option>
											<option value="Processing">Đang xử lý</option>
											<option value="Shipped">Đã gửi hàng</option>
											<option value="Delivered">Đã giao</option>
											<option value="Cancelled">Đã hủy</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
