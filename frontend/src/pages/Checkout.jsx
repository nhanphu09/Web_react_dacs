import { CheckCircle, CreditCard, Truck } from "lucide-react"; // 🟢 THÊM ICONS
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";
import { useAuth } from "../context/AuthProvider"; // 🟢 1. IMPORT AUTH CONTEXT

export default function Checkout() {
	const { user } = useAuth(); // 🟢 2. LẤY THÔNG TIN USER
	const navigate = useNavigate();

	// 🟢 3. CẬP NHẬT STATE BAN ĐẦU
	const [address, setAddress] = useState({
		name: user?.name || "", // Tự động điền
		email: user?.email || "", // Tự động điền
		phone: "", // Trường mới
		line1: "",
		city: "",
		postal: "",
	});
	const [paymentMethod, setPaymentMethod] = useState("COD");
	const [isPlacingOrder, setIsPlacingOrder] = useState(false);

	const cart = JSON.parse(localStorage.getItem("cart") || "[]");

	// (Giữ nguyên logic tính toán)
	const itemsPrice = cart.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
	const shipping = itemsPrice > 1000000 ? 0 : 30000;
	const total = itemsPrice + shipping;

	const formatCurrency = (amount) => {
		return amount.toLocaleString("vi-VN", {
			style: "currency",
			currency: "VND",
		});
	};

	const placeOrder = async () => {
		if (cart.length === 0) {
			toast.warn("Giỏ hàng của bạn đang trống!");
			return;
		}
		// 🟢 SỬA: Kiểm tra SĐT và Email
		if (
			!address.name ||
			!address.line1 ||
			!address.city ||
			!address.phone ||
			!address.email
		) {
			toast.warn("Vui lòng điền đầy đủ thông tin giao hàng!");
			return;
		}

		setIsPlacingOrder(true);
		try {
			const orderData = {
				products: cart.map((it) => ({
					product: it.product,
					quantity: it.qty,
				})),
				totalPrice: total,
				shippingAddress: address,
				paymentMethod: paymentMethod,
			};

			await api.post("/orders", orderData);

			toast.success("✅ Đặt hàng thành công!");
			localStorage.removeItem("cart");
			navigate("/orders");
		} catch (e) {
			toast.error("❌ Đặt hàng thất bại. Vui lòng thử lại.");
		} finally {
			setIsPlacingOrder(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
			<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
				<CreditCard className="text-primary" /> Thanh toán
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-5 gap-8">
				{/* CỘT TRÁI: THÔNG TIN (chiếm 3/5) */}
				<div className="md:col-span-3">
					<h3 className="text-xl font-semibold text-gray-700 mb-4">
						Thông tin giao hàng
					</h3>

					{/* 🟢 SỬA: Form với các trường mới */}
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-gray-700">
								Họ và tên
							</label>
							<input
								type="text"
								placeholder="Nguyễn Văn A"
								value={address.name}
								onChange={(e) =>
									setAddress({ ...address, name: e.target.value })
								}
								className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
							/>
						</div>

						{/* 🟢 THÊM: 2 TRƯỜNG MỚI (EMAIL VÀ SĐT) */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-gray-700">
									Email (Để nhận xác nhận)
								</label>
								<input
									type="email"
									placeholder="nguyenvana@gmail.com"
									value={address.email}
									onChange={(e) =>
										setAddress({ ...address, email: e.target.value })
									}
									className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700">
									Số điện thoại
								</label>
								<input
									type="tel"
									placeholder="0901234567"
									value={address.phone}
									onChange={(e) =>
										setAddress({ ...address, phone: e.target.value })
									}
									className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
								/>
							</div>
						</div>

						<div>
							<label className="text-sm font-medium text-gray-700">
								Địa chỉ
							</label>
							<input
								type="text"
								placeholder="Số 123, đường ABC, phường XYZ"
								value={address.line1}
								onChange={(e) =>
									setAddress({ ...address, line1: e.target.value })
								}
								className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-gray-700">
									Thành phố/Tỉnh
								</label>
								<input
									type="text"
									placeholder="Hà Nội"
									value={address.city}
									onChange={(e) =>
										setAddress({ ...address, city: e.target.value })
									}
									className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700">
									Mã bưu điện (Tùy chọn)
								</label>
								<input
									type="text"
									placeholder="100000"
									value={address.postal}
									onChange={(e) =>
										setAddress({ ...address, postal: e.target.value })
									}
									className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
								/>
							</div>
						</div>
					</div>

					{/* 🟢 SỬA: PHƯƠNG THỨC THANH TOÁN (DÙNG RADIO) */}
					<h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
						Phương thức thanh toán
					</h3>
					<div className="space-y-3">
						<label
							className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
								paymentMethod === "COD"
									? "border-primary ring-2 ring-primary"
									: "border-gray-300"
							}`}>
							<input
								type="radio"
								name="paymentMethod"
								value="COD"
								checked={paymentMethod === "COD"}
								onChange={(e) => setPaymentMethod(e.target.value)}
								className="hidden"
							/>
							<Truck size={24} className="text-gray-600" />
							<span className="font-medium text-gray-800">
								Thanh toán khi nhận hàng (COD)
							</span>
							{paymentMethod === "COD" && (
								<CheckCircle size={20} className="text-primary ml-auto" />
							)}
						</label>
						<label
							className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
								paymentMethod === "Bank"
									? "border-primary ring-2 ring-primary"
									: "border-gray-300"
							}`}>
							<input
								type="radio"
								name="paymentMethod"
								value="Bank"
								checked={paymentMethod === "Bank"}
								onChange={(e) => setPaymentMethod(e.target.value)}
								className="hidden"
							/>
							<CreditCard size={24} className="text-gray-600" />
							<span className="font-medium text-gray-800">
								Chuyển khoản ngân hàng (Sắp ra mắt)
							</span>
							{paymentMethod === "Bank" && (
								<CheckCircle size={20} className="text-primary ml-auto" />
							)}
						</label>
					</div>
				</div>

				{/* CỘT PHẢI: TÓM TẮT (Giữ nguyên) */}
				<div className="md:col-span-2 border border-gray-200 rounded-xl p-6 shadow-sm bg-gray-50 h-fit sticky top-24">
					<h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-3">
						Tóm tắt đơn hàng
					</h3>
					<div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
						{cart.map((item) => (
							<div key={item.product} className="flex items-center gap-3">
								<div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
									<img
										src={item.image}
										alt={item.title}
										className="w-full h-full object-contain"
									/>
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-800 line-clamp-1">
										{item.title}
									</p>
									<p className="text-sm text-gray-500">SL: {item.qty}</p>
								</div>
								<p className="text-sm font-medium text-gray-900">
									{formatCurrency(item.price * item.qty)}
								</p>
							</div>
						))}
					</div>
					<div className="space-y-2 text-gray-700 border-t pt-4">
						<div className="flex justify-between">
							<span>Tạm tính:</span>
							<span className="font-medium text-gray-900">
								{formatCurrency(itemsPrice)}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Vận chuyển:</span>
							<span className="font-medium text-gray-900">
								{shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}
							</span>
						</div>
						<hr className="my-3" />
						<div className="text-xl font-bold flex justify-between">
							<span>Tổng cộng:</span>
							<span className="text-primary">{formatCurrency(total)}</span>
						</div>
					</div>
					<button
						onClick={placeOrder}
						className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-secondary transition-all duration-300 disabled:opacity-50"
						disabled={isPlacingOrder}>
						{isPlacingOrder ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
					</button>
				</div>
			</div>
		</div>
	);
}
