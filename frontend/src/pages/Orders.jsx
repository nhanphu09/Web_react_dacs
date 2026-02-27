import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import ProfileSidebar from "../components/ProfileSidebar";

export default function Orders() {
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const { data } = await api.get("/orders/my-orders");
				setOrders(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	const getStatusColor = (status) => {
		switch (status) {
			case "Delivered": return "text-green-600 bg-green-100";
			case "Cancelled": return "text-red-600 bg-red-100";
			case "Shipped": return "text-blue-600 bg-blue-100";
			default: return "text-yellow-600 bg-yellow-100";
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar */}
				<ProfileSidebar />

				{/* Nội dung chính */}
				<div className="flex-1">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
						<Package className="text-primary" /> Lịch sử đơn hàng
					</h2>

					{loading ? (
						<div className="text-center p-10">Đang tải dữ liệu...</div>
					) : orders.length === 0 ? (
						<div className="bg-white p-8 rounded-xl shadow text-center">
							<p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
						</div>
					) : (
						<div className="space-y-6">
							{orders.map((order) => (
								<div key={order._id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
									{/* Header Đơn hàng */}
									<div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b">
										<div>
											<p className="text-xs text-gray-500 uppercase font-bold">Mã đơn</p>
											<p className="font-mono font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase font-bold">Ngày đặt</p>
											<p className="font-medium text-gray-700">
												{new Date(order.createdAt).toLocaleDateString("vi-VN")}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase font-bold">Tổng tiền</p>
											<p className="font-bold text-primary text-lg">
												{order.totalPrice?.toLocaleString("vi-VN")} đ
											</p>
										</div>
										<span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
											{order.status}
										</span>
									</div>

									{/* Báo trạng thái giao hàng / Nút Đánh giá */}
									<div className="px-6 pt-4">
										{order.status === "Delivered" ? (
											<div className="bg-green-100 p-4 rounded-lg mb-2 border border-green-500">
												<p className="text-green-700 font-bold">🎉 Đơn hàng đã được giao thành công!</p>
												<p className="text-sm text-green-800">Bạn hãy dành chút thời gian đánh giá sản phẩm để nhận ưu đãi nhé.</p>
												<div className="flex flex-wrap gap-2 mt-3">
													{order.products.map((item, idx) => (
														<button
															key={idx}
															onClick={() => navigate(`/review/${item.product?._id}`)}
															className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition"
														>
															Đánh giá {item.product?.title}
														</button>
													))}
												</div>
											</div>
										) : order.status === "Shipped" ? (
											<div className="bg-yellow-100 p-4 rounded-lg mb-2 border border-yellow-400">
												<p className="text-yellow-800 font-bold">🚚 Đơn hàng của bạn đang được vận chuyển...</p>
											</div>
										) : null}
									</div>

									{/* Danh sách sản phẩm */}
									<div className="p-6">
										{order.products.map((item, index) => (
											<div key={index} className="flex items-center gap-4 mb-4 last:mb-0">
												<div className="w-16 h-16 bg-white border rounded-md overflow-hidden flex-shrink-0">
													<img
														src={item.product?.image || "https://placehold.co/100"}
														alt={item.product?.title}
														className="w-full h-full object-contain"
													/>
												</div>
												<div className="flex-1">
													<p className="font-medium text-gray-800 line-clamp-1">
														{item.product?.title || "Sản phẩm đã bị xóa"}
													</p>
													<p className="text-sm text-gray-500">x{item.quantity}</p>
												</div>
												<p className="font-medium text-gray-700">
													{((item.product?.price || 0) * item.quantity).toLocaleString("vi-VN")} đ
												</p>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}