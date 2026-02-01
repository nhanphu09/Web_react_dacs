import { ShoppingBag, Trash2, ArrowRight, Tag } from "lucide-react"; // Thêm icon Tag
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import QuantityInput from "../components/QuantityInput";
import api from "../api/client"; // Import API client

export default function Cart() {
	const [cart, setCart] = useState([]);
	const navigate = useNavigate();

	// --- State cho Coupon ---
	const [couponCode, setCouponCode] = useState("");
	const [discountPercent, setDiscountPercent] = useState(0); // Mặc định 0%
	const [isApplying, setIsApplying] = useState(false);

	// Load giỏ hàng từ LocalStorage
	useEffect(() => {
		const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
		setCart(storedCart);
	}, []);

	// Cập nhật số lượng
	const updateQty = (productId, newQty) => {
		const updatedCart = cart.map((item) =>
			item.product === productId ? { ...item, qty: Math.max(1, newQty) } : item
		);
		setCart(updatedCart);
		localStorage.setItem("cart", JSON.stringify(updatedCart));
	};

	// Xóa sản phẩm
	const removeItem = (productId) => {
		const updatedCart = cart.filter((item) => item.product !== productId);
		setCart(updatedCart);
		localStorage.setItem("cart", JSON.stringify(updatedCart));
		toast.info("Đã xóa sản phẩm khỏi giỏ.");
	};

	// --- Xử lý Mã Giảm Giá ---
	const handleApplyCoupon = async () => {
		if (!couponCode.trim()) {
			toast.warn("Vui lòng nhập mã giảm giá!");
			return;
		}

		setIsApplying(true);
		try {
			const res = await api.post("/coupons/validate", { code: couponCode });
			setDiscountPercent(res.data.discount);
			toast.success(`Áp dụng mã thành công! Giảm ${res.data.discount}%`);
		} catch (err) {
			setDiscountPercent(0); // Reset nếu lỗi
			toast.error(err.response?.data?.message || "Mã không hợp lệ hoặc đã hết hạn");
		} finally {
			setIsApplying(false);
		}
	};

	// --- Logic Tính Tiền Mới ---
	const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

	// Tính tiền giảm giá
	const discountAmount = (subtotal * discountPercent) / 100;

	// Phí ship (Tính trên subtotal gốc)
	const shippingFee = subtotal > 1000000 ? 0 : 30000;

	// Tổng cuối cùng
	const total = subtotal - discountAmount + shippingFee;

	// Helper format tiền
	const formatCurrency = (amount) => {
		return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
	};

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
			<h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
				<ShoppingBag className="text-primary" /> Giỏ hàng của bạn
			</h2>

			{cart.length === 0 ? (
				<div className="text-center py-16 bg-white rounded-xl shadow-sm">
					<img
						src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
						alt="Empty Cart"
						className="w-32 h-32 mx-auto mb-4 opacity-50"
					/>
					<p className="text-gray-500 text-lg mb-6">Giỏ hàng đang trống trơn!</p>
					<Link
						to="/products"
						className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-secondary transition">
						Mua sắm ngay
					</Link>
				</div>
			) : (
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Danh sách sản phẩm */}
					<div className="flex-1 space-y-4">
						{cart.map((item) => (
							<div key={item.product} className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
								<img
									src={item.image}
									alt={item.title}
									className="w-24 h-24 object-contain rounded-md border"
								/>
								<div className="flex-1 text-center sm:text-left">
									<h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{item.title}</h3>
									<p className="text-primary font-bold">
										{formatCurrency(item.price)}
									</p>
								</div>

								<div className="flex items-center gap-4">
									<QuantityInput
										value={item.qty}
										onChange={(val) => updateQty(item.product, val)}
										onIncrease={() => updateQty(item.product, item.qty + 1)}
										onDecrease={() => updateQty(item.product, item.qty - 1)}
									/>
									<button
										onClick={() => removeItem(item.product)}
										className="text-gray-400 hover:text-red-600 transition p-2">
										<Trash2 size={20} />
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Tóm tắt đơn hàng */}
					<div className="w-full lg:w-96">
						<div className="bg-white p-6 rounded-xl shadow-lg border sticky top-24">
							<h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Tóm tắt đơn hàng</h3>

							{/* --- Ô NHẬP MÃ GIẢM GIÁ --- */}
							<div className="mb-6">
								<label className="text-sm font-medium text-gray-700 mb-2 block">Mã giảm giá</label>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<Tag size={16} className="absolute left-3 top-3 text-gray-400" />
										<input
											type="text"
											placeholder="Nhập mã voucher"
											value={couponCode}
											onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
											className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none uppercase"
										/>
									</div>
									<button
										onClick={handleApplyCoupon}
										disabled={isApplying}
										className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 disabled:opacity-70 transition">
										{isApplying ? "..." : "Áp dụng"}
									</button>
								</div>
							</div>

							<div className="space-y-3 mb-6 text-gray-600">
								<div className="flex justify-between">
									<span>Tạm tính:</span>
									<span className="font-medium">{formatCurrency(subtotal)}</span>
								</div>

								{/* Hiển thị dòng giảm giá nếu có */}
								{discountPercent > 0 && (
									<div className="flex justify-between text-green-600 font-medium">
										<span>Giảm giá ({discountPercent}%):</span>
										<span>-{formatCurrency(discountAmount)}</span>
									</div>
								)}

								<div className="flex justify-between">
									<span>Phí vận chuyển:</span>
									<span className="font-medium">
										{shippingFee === 0 ? <span className="text-green-600">Miễn phí</span> : formatCurrency(shippingFee)}
									</span>
								</div>

								<div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3 mt-3">
									<span>Tổng cộng:</span>
									<span className="text-primary">{formatCurrency(total)}</span>
								</div>
							</div>

							<button
								onClick={() => navigate("/checkout", { state: { discountPercent, discountAmount, total } })}
								className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition flex items-center justify-center gap-2 shadow-lg shadow-red-100">
								Tiến hành đặt hàng <ArrowRight size={20} />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}