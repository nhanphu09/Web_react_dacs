import { Clock, PackageCheck, Truck, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function Orders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await api.get("/orders//my-orders");
				setOrders(res.data);
			} catch (error) {
				console.error("Failed to fetch orders", error);
			}
		};
		fetchOrders();
	}, []);

	// Helper hiển thị icon + màu cho trạng thái
	const renderStatus = (status) => {
		switch (status) {
			case "Delivered":
				return (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium text-sm">
						<PackageCheck size={16} /> Delivered
					</span>
				);
			case "Processing":
				return (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium text-sm">
						<Clock size={16} /> Processing
					</span>
				);
			case "Shipped":
				return (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
						<Truck size={16} /> Shipped
					</span>
				);
			default:
				return (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-medium text-sm">
						<XCircle size={16} /> Pending
					</span>
				);
		}
	};

	return (
		<div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
			<h2 className="text-3xl font-bold text-primary mb-8 text-center">
				📦 My Orders
			</h2>

			{orders.length === 0 ? (
				<p className="text-gray-600 text-center py-10 text-lg">
					You haven't placed any orders yet.
				</p>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<div
							key={order._id}
							className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden">
							{/* Header */}
							<div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
								<div>
									<p className="text-sm text-gray-500">
										Order ID:{" "}
										<span className="font-mono text-gray-800">{order._id}</span>
									</p>
									<p className="text-sm text-gray-600">
										Placed on:{" "}
										{new Date(order.createdAt).toLocaleDateString("en-GB")}
									</p>
								</div>
								{renderStatus(order.status)}
							</div>

							{/* Items */}
							<div className="px-6 py-4 divide-y divide-gray-100">
								{order.orderItems?.map((it, idx) => (
									<div
										key={idx}
										className="flex justify-between items-center py-2 text-gray-700">
										<div>
											<p className="font-medium">{it.name || it.product}</p>
											<p className="text-sm text-gray-500">Qty: {it.qty}</p>
										</div>
										<p className="font-semibold">
											${(it.price * it.qty).toFixed(2)}
										</p>
									</div>
								))}
							</div>

							{/* Footer */}
							<div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
								<p className="text-gray-600 text-sm">
									Shipping:{" "}
									<span className="font-medium text-gray-800">
										${order.shippingPrice?.toFixed(2) ?? 0}
									</span>
								</p>
								<p className="text-lg font-bold text-primary">
									Total: ${order.totalPrice?.toFixed(2) ?? 0}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
