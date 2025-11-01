import {
	Clock,
	LogOut,
	Package,
	PackageCheck,
	Truck,
	User,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthProvider";

// Component Sidebar
const ProfileSidebar = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<aside className="w-full bg-white p-6 rounded-2xl shadow-lg">
			<nav className="flex flex-col space-y-3">
				<Link
					to="/profile"
					className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all">
					<User size={20} />
					Thông tin cá nhân
				</Link>
				<Link
					to="/orders"
					className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-primary text-white shadow transition-all">
					<Package size={20} />
					Lịch sử đơn hàng
				</Link>
				<button
					onClick={handleLogout}
					className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all">
					<LogOut size={20} />
					Đăng xuất
				</button>
			</nav>
		</aside>
	);
};

export default function Orders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await api.get("/orders/my-orders");
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
						<PackageCheck size={16} /> Đã giao
					</span>
				);
			case "Processing":
				return (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium text-sm">
						<Clock size={16} /> Đang xử lý
					</span>
				);
			case "Shipped":
				return (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
						<Truck size={16} /> Đang vận chuyển
					</span>
				);
			case "Cancelled":
				return (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium text-sm">
						<XCircle size={16} /> Đã hủy
					</span>
				);
			default:
				return (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-medium text-sm">
						Chờ xử lý
					</span>
				);
		}
	};

	// Hàm định dạng tiền tệ
	const formatCurrency = (amount) => {
		if (typeof amount !== "number") {
			amount = 0;
		}
		return amount.toLocaleString("vi-VN", {
			style: "currency",
			currency: "VND",
		});
	};

	return (
		<div className="max-w-7xl mx-auto p-6 mt-10">
			<h2 className="text-3xl font-bold text-gray-800 mb-8">
				Tài khoản của tôi
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* Cột 1: Sidebar */}
				<div className="md:col-span-1">
					<ProfileSidebar />
				</div>

				{/* Cột 2: Nội dung "My Orders" */}
				<div className="md:col-span-3">
					<div className="bg-white shadow-lg rounded-2xl p-8">
						<h3 className="text-2xl font-bold text-primary mb-6 text-left">
							📦 Đơn hàng của tôi
						</h3>

						{orders.length === 0 ? (
							<p className="text-gray-600 text-center py-10 text-lg">
								Bạn chưa có đơn hàng nào.
							</p>
						) : (
							<div className="space-y-6">
								{orders.map((order) => (
									<div
										key={order._id}
										className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden">
										{/* Header */}
										<div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center">
											<div>
												<p className="text-sm text-gray-500">
													Mã đơn:{" "}
													<span className="font-mono text-gray-800">
														{order._id}
													</span>
												</p>
												<p className="text-sm text-gray-600">
													Ngày đặt:{" "}
													{new Date(order.createdAt).toLocaleDateString(
														"vi-VN"
													)}
												</p>
											</div>
											{renderStatus(order.status)}
										</div>

										{/* Items */}
										<div className="px-6 py-4 divide-y divide-gray-100">
											{order.products?.map((it, idx) => (
												<div
													key={idx}
													className="flex justify-between items-center py-3">
													<div className="flex items-center gap-3">
														{/* Thêm ảnh sản phẩm */}
														<div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
															<img
																src={it.product?.image}
																alt={it.product?.title}
																className="w-full h-full object-contain"
															/>
														</div>
														<div>
															<p className="font-medium">
																{it.product?.title || "Sản phẩm đã bị xóa"}
															</p>
															<p className="text-sm text-gray-500">
																SL: {it.quantity}
															</p>
														</div>
													</div>
													<p className="font-semibold text-sm">
														{formatCurrency(
															(it.product?.price || 0) * it.quantity
														)}
													</p>
												</div>
											))}
										</div>

										{/* Footer */}
										<div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
											<p className="text-gray-600 text-sm">
												{/* (Bạn có thể thêm phí vận chuyển vào model sau) */}
											</p>
											<p className="text-lg font-bold text-primary">
												Tổng: {formatCurrency(order.totalPrice ?? 0)}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
