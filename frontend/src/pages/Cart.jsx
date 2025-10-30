import { ShoppingBag, ShoppingCart, Trash2 } from "lucide-react"; // 🟢 THÊM: ShoppingCart ICON
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuantityInput from "../components/QuantityInput";

export default function Cart() {
	const [cart, setCart] = useState([]);
	const [promoCode, setPromoCode] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("cart") || "[]");
		setCart(stored);
	}, []);

	// ... (Tất cả các hàm: updateQty, removeItem, subtotal, shipping, total, formatCurrency... giữ nguyên)
	const updateQty = (index, qty) => {
		const newCart = [...cart];
		newCart[index].qty = Math.max(1, Number(qty));
		setCart(newCart);
		localStorage.setItem("cart", JSON.stringify(newCart));
	};

	const removeItem = (index) => {
		const newCart = cart.filter((_, i) => i !== index);
		setCart(newCart);
		localStorage.setItem("cart", JSON.stringify(newCart));
	};

	const subtotal = cart.reduce(
		(sum, item) => sum + (item.price || 0) * item.qty,
		0
	);
	const shipping = subtotal > 1000000 ? 0 : 30000;
	const total = subtotal + shipping;

	const formatCurrency = (amount) => {
		return amount.toLocaleString("vi-VN", {
			style: "currency",
			currency: "VND",
		});
	};

	return (
		<div className="max-w-7xl mx-auto p-6 mt-10">
			<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
				<ShoppingBag className="text-primary" /> Giỏ hàng của bạn
			</h2>

			{/* 🟢 SỬA: PHẦN HIỂN THỊ KHI GIỎ HÀNG TRỐNG */}
			{cart.length === 0 ? (
				<div className="text-center py-20 bg-white rounded-2xl shadow-lg text-gray-500">
					{/* Thêm icon lớn */}
					<ShoppingCart size={64} className="mx-auto text-gray-300" />
					<h3 className="text-2xl font-semibold text-gray-800 mt-4">
						Giỏ hàng của bạn đang trống
					</h3>
					<p className="text-lg mb-6 mt-2">
						Trông có vẻ như bạn chưa thêm sản phẩm nào vào giỏ.
					</p>
					<button
						onClick={() => navigate("/products")}
						className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-transform transform hover:scale-105">
						🛍️ Bắt đầu mua sắm
					</button>
				</div>
			) : (
				// PHẦN HIỂN THỊ KHI CÓ SẢN PHẨM (Giữ nguyên)
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* CỘT BÊN TRÁI: DANH SÁCH SẢN PHẨM */}
					<div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
						<div className="space-y-5">
							{cart.map((item, index) => (
								<div
									key={index}
									className="flex flex-col md:flex-row items-center justify-between border-b border-gray-200 pb-5">
									{/* Thông tin sản phẩm */}
									<div className="flex items-center gap-5 flex-1 mb-4 md:mb-0">
										<div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
											<img
												src={item.image}
												alt={item.title}
												className="object-contain w-full h-full"
											/>
										</div>
										<div>
											<p className="font-semibold text-lg text-gray-800">
												{item.title}
											</p>
											<p className="text-gray-600 text-sm">
												Giá:{" "}
												<span className="text-primary font-medium">
													{formatCurrency(item.price)}
												</span>
											</p>
										</div>
									</div>

									{/* Số lượng và nút xóa */}
									<div className="flex items-center gap-4">
										<QuantityInput
											value={item.qty}
											onDecrease={() => updateQty(index, item.qty - 1)}
											onIncrease={() => updateQty(index, item.qty + 1)}
											onChange={(newQty) => updateQty(index, newQty)}
										/>
										<button
											onClick={() => removeItem(index)}
											className="text-gray-500 hover:text-red-600 transition">
											<Trash2 size={20} />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* CỘT BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
					<div className="lg:col-span-1 h-fit lg:sticky lg:top-24">
						<div className="bg-white p-6 rounded-2xl shadow-lg">
							<h3 className="text-xl font-bold mb-4 border-b pb-3">
								Tóm tắt đơn hàng
							</h3>

							{/* Ô MÃ KHUYẾN MÃI */}
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Mã khuyến mãi
								</label>
								<div className="flex">
									<input
										type="text"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value)}
										placeholder="Nhập mã của bạn"
										className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
									/>
									<button className="bg-gray-800 text-white px-4 rounded-r-md text-sm font-semibold hover:bg-gray-700">
										Áp dụng
									</button>
								</div>
							</div>

							{/* Phần tính tiền */}
							<div className="space-y-3 text-gray-700 border-t pt-4">
								<div className="flex justify-between">
									<span>Tạm tính:</span>
									<span className="font-medium text-gray-900">
										{formatCurrency(subtotal)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Vận chuyển:</span>
									<span className="font-medium text-gray-900">
										{shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}
									</span>
								</div>
								<div className="border-t pt-3 mt-3 flex justify-between text-xl font-bold">
									<span className="text-gray-900">Tổng cộng:</span>
									<span className="text-primary">{formatCurrency(total)}</span>
								</div>
							</div>

							{/* Nút bấm */}
							<div className="mt-6 space-y-3">
								<button
									onClick={() => navigate("/checkout")}
									className="w-full bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-secondary transition">
									Thanh toán 💳
								</button>
								<button
									onClick={() => navigate("/products")}
									className="w-full border border-primary text-primary px-4 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition">
									⬅️ Tiếp tục mua sắm
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
