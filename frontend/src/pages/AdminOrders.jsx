import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

export default function AdminOrders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await api.get("/orders");
				setOrders(res.data);
			} catch (error) {
				console.error("Failed to fetch orders", error);
			}
		};
		fetchOrders();
	}, []);

	const updateStatus = async (id, status) => {
		try {
			await api.put(`/orders/${id}/status`, { status });
			setOrders((prev) =>
				prev.map((o) => (o._id === id ? { ...o, status } : o))
			);
		} catch (error) {
			toast.warn("Cập nhật trạng thái đơn hàng thất bại!");
		}
	};

	const statusBadge = (status) => {
		switch (status) {
			case "Processing":
				return (
					<span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm rounded-full font-semibold flex items-center gap-1">
						<Clock size={14} /> Đang xử lý
					</span>
				);
			case "Shipped":
				return (
					<span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full font-semibold flex items-center gap-1">
						<Truck size={14} /> Đã gửi hàng
					</span>
				);
			case "Delivered":
				return (
					<span className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full font-semibold flex items-center gap-1">
						<CheckCircle size={14} /> Đã giao
					</span>
				);
			case "Cancelled":
				return (
					<span className="bg-red-100 text-red-800 px-3 py-1 text-sm rounded-full font-semibold flex items-center gap-1">
						<XCircle size={14} /> Đã hủy
					</span>
				);
			default:
				return (
					<span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full font-semibold">
						Chờ xử lý
					</span>
				);
		}
	};

	return (
		<div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen rounded-xl">
			<h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
				<Package className="text-primary" /> Quản lý đơn hàng
			</h2>

			{orders.length === 0 ? (
				<p className="text-gray-600 text-center py-10">
					Không có đơn hàng nào.
				</p>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<div
							key={order._id}
							className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition">
							{/* Header */}
							<div className="flex justify-between items-center mb-3">
								<div>
									<p className="text-sm text-gray-500">
										<span className="font-medium text-gray-800">
											🧾 Mã đơn:
										</span>{" "}
										{order._id}
									</p>
									<p className="text-sm text-gray-600">
										👤 Khách hàng:{" "}
										<span className="font-medium">
											{order.user?.name || "Không rõ"}
										</span>
									</p>
								</div>

								{/* Badge */}
								{statusBadge(order.status)}
							</div>

							{/* Items */}
							<div className="border-t border-gray-200 pt-3 space-y-1">
								{order.orderItems?.map((it, idx) => (
									<div
										key={idx}
										className="flex justify-between text-sm text-gray-700">
										<p>
											{it.name || it.product} × {it.qty}
										</p>
										<p>{(it.price * it.qty).toLocaleString("vi-VN")} đ</p>
									</div>
								))}
							</div>

							{/* Tổng tiền */}
							<div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
								<p className="text-gray-600">
									Phí vận chuyển:{" "}
									<span className="font-medium text-gray-800">
										{order.shippingPrice?.toLocaleString("vi-VN") ?? 0} đ
									</span>
								</p>
								<p className="text-xl font-bold text-primary">
									Tổng: {order.totalPrice?.toLocaleString("vi-VN") ?? 0} đ
								</p>
							</div>

							{/* Buttons */}
							<div className="flex flex-wrap gap-3 mt-5">
								{["Processing", "Shipped", "Delivered", "Cancelled"].map(
									(st) => (
										<button
											key={st}
											onClick={() => updateStatus(order._id, st)}
											className={`px-4 py-2 rounded-md text-sm font-medium transition ${
												st === "Processing"
													? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
													: st === "Shipped"
													? "bg-blue-100 text-blue-800 hover:bg-blue-200"
													: st === "Delivered"
													? "bg-green-100 text-green-800 hover:bg-green-200"
													: "bg-red-100 text-red-800 hover:bg-red-200"
											}`}>
											{st}
										</button>
									)
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
