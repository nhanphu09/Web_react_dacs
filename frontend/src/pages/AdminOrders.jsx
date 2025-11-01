import { Eye, Package, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

const OrderDetailModal = ({ order, onClose }) => {
	if (!order) return null;

	const formatCurrency = (amount) => {
		return (amount || 0).toLocaleString("vi-VN", {
			style: "currency",
			currency: "VND",
		});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center p-6 border-b">
					<h3 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-800">
						<X size={24} />
					</button>
				</div>

				<div className="p-6">
					<div className="grid grid-cols-2 gap-4 mb-4">
						<div>
							<h4 className="font-semibold text-gray-700">Khách hàng</h4>
							<p>{order.user?.name}</p>
							<p>{order.shippingAddress?.email}</p>
							<p>{order.shippingAddress?.phone}</p>
						</div>
						<div>
							<h4 className="font-semibold text-gray-700">Địa chỉ giao hàng</h4>
							<p>{order.shippingAddress?.line1}</p>
							<p>{order.shippingAddress?.city}</p>
							<p>{order.shippingAddress?.postal}</p>
						</div>
						<div>
							<h4 className="font-semibold text-gray-700">Trạng thái</h4>
							<p>{order.status}</p>
						</div>
						<div>
							<h4 className="font-semibold text-gray-700">Thanh toán</h4>
							<p>{order.paymentMethod}</p>
						</div>
					</div>

					<h4 className="font-semibold text-gray-700 mb-2">Sản phẩm</h4>
					<div className="space-y-3 border-t pt-3">
						{order.products.map((item) => (
							<div key={item._id} className="flex items-center gap-3">
								<img
									src={item.product?.image}
									alt={item.product?.title}
									className="w-16 h-16 object-contain rounded-md bg-gray-100"
								/>
								<div className="flex-1">
									<p className="font-medium">{item.product?.title}</p>
									<p className="text-sm text-gray-600">
										SL: {item.quantity} x {formatCurrency(item.product?.price)}
									</p>
								</div>
								<p className="font-semibold">
									{formatCurrency(item.product?.price * item.quantity)}
								</p>
							</div>
						))}
					</div>

					<div className="border-t mt-4 pt-4 flex justify-end">
						<p className="text-xl font-bold text-primary">
							Tổng cộng: {formatCurrency(order.totalPrice)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const filterTabs = [
	{ label: "Tất cả", value: "" },
	{ label: "Chờ xử lý", value: "Pending" },
	{ label: "Đang xử lý", value: "Processing" },
	{ label: "Đã gửi hàng", value: "Shipped" },
	{ label: "Đã giao", value: "Delivered" },
	{ label: "Đã hủy", value: "Cancelled" },
];

export default function AdminOrders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState("");
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const params = {
					sort: "createdAt_desc",
					page: page,
				};
				if (filterStatus) {
					params.status = filterStatus;
				}
				if (keyword) {
					params.keyword = keyword;
				}

				const res = await api.get("/orders", { params });
				setOrders(res.data.orders);
				setTotalPages(res.data.totalPages);
			} catch (error) {
				console.error("Failed to fetch orders", error);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, [filterStatus, page, keyword]);

	const handleViewDetails = async (orderId) => {
		try {
			const res = await api.get(`/orders/${orderId}`);
			setSelectedOrder(res.data);
			setIsModalOpen(true);
		} catch (err) {
			toast.error("Không thể tải chi tiết đơn hàng!");
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedOrder(null);
	};

	const handleFilterChange = (status) => {
		setFilterStatus(status);
		setKeyword("");
		setPage(1);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setFilterStatus("");
		setPage(1);
	};

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

	const formatCurrency = (amount) => {
		return (amount || 0).toLocaleString("vi-VN", {
			style: "currency",
			currency: "VND",
		});
	};

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

			{/* THANH LỌC (FILTER BAR) */}
			<div className="bg-white rounded-xl shadow p-4 mb-6">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex flex-wrap items-center gap-2">
						{filterTabs.map((tab) => (
							<button
								key={tab.value}
								onClick={() => handleFilterChange(tab.value)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
									filterStatus === tab.value
										? "bg-primary text-white shadow"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}>
								{tab.label}
							</button>
						))}
					</div>
					<form
						onSubmit={handleSearch}
						className="flex items-center w-full md:w-auto">
						<input
							type="text"
							placeholder="Tìm theo Tên khách hoặc Mã đơn..."
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
							className="border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
						/>
						<button
							type="submit"
							className="bg-primary text-white p-2 rounded-r-lg hover:bg-secondary">
							<Search size={20} />
						</button>
					</form>
				</div>
			</div>

			{/* BẢNG (TABLE) */}
			<div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
				{loading ? (
					<p className="text-gray-600 text-center py-10">
						Đang tải đơn hàng...
					</p>
				) : orders.length === 0 ? (
					<p className="text-gray-600 text-center py-10">
						Không có đơn hàng nào khớp.
					</p>
				) : (
					<>
						<table className="w-full min-w-[800px]">
							<thead className="bg-gray-100 text-left text-gray-700">
								<tr>
									<th className="py-3 px-4">Mã đơn</th>
									<th className="py-3 px-4">Ngày đặt</th>
									<th className="py-3 px-4">Khách hàng</th>
									<th className="py-3 px-4">Tổng tiền</th>
									<th className="py-3 px-4">Trạng thái</th>
									<th className="py-3 px-4 text-center">Hành động</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr
										key={order._id}
										className="border-b hover:bg-gray-50 transition">
										<td className="py-3 px-4 text-sm font-mono text-gray-600">
											{order._id.substring(0, 8)}...
										</td>
										<td className="py-3 px-4 text-sm text-gray-700">
											{new Date(order.createdAt).toLocaleDateString("vi-VN")}
										</td>
										<td className="py-3 px-4 font-medium text-gray-800">
											{order.user?.name || "Không rõ"}
										</td>
										<td className="py-3 px-4 font-semibold text-primary">
											{formatCurrency(order.totalPrice)}
										</td>
										<td className="py-3 px-4">{statusBadge(order.status)}</td>
										<td className="py-3 px-4">
											<div className="flex justify-center items-center gap-2">
												<button
													onClick={() => handleViewDetails(order._id)}
													className="text-gray-500 hover:text-primary p-1">
													<Eye size={18} />
												</button>
												<select
													value={order.status}
													onChange={(e) =>
														updateStatus(order._id, e.target.value)
													}
													className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white">
													<option value="Pending">Chờ xử lý</option>
													<option value="Processing">Đang xử lý</option>
													<option value="Shipped">Đã gửi hàng</option>
													<option value="Delivered">Đã giao</option>
													<option value="Cancelled">Đã hủy</option>
												</select>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{totalPages > 1 && (
							<div className="flex justify-center items-center gap-4 mt-6">
								<button
									onClick={() => setPage((p) => Math.max(p - 1, 1))}
									disabled={page === 1}
									className="bg-white px-4 py-2 rounded-md shadow border disabled:opacity-50">
									Trước
								</button>
								<span className="font-medium">
									Trang {page} / {totalPages}
								</span>
								<button
									onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
									disabled={page === totalPages}
									className="bg-white px-4 py-2 rounded-md shadow border disabled:opacity-50">
									Sau
								</button>
							</div>
						)}
					</>
				)}
			</div>

			{/* Render Modal */}
			{isModalOpen && (
				<OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
			)}
		</div>
	);
}
