import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import QuantityInput from "../components/QuantityInput";

export default function Cart() {
	const [cart, setCart] = useState([]);
	const navigate = useNavigate();

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

	// Logic tính tiền
	const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
	const shippingFee = subtotal > 1000000 ? 0 : 30000; // Miễn phí nếu > 1 triệu
	const total = subtotal + shippingFee;

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
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
										{item.price.toLocaleString("vi-VN")} đ
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

							<div className="space-y-3 mb-6 text-gray-600">
								<div className="flex justify-between">
									<span>Tạm tính:</span>
									<span className="font-medium">{subtotal.toLocaleString("vi-VN")} đ</span>
								</div>
								<div className="flex justify-between">
									<span>Phí vận chuyển:</span>
									<span className="font-medium">
										{shippingFee === 0 ? <span className="text-green-600">Miễn phí</span> : `${shippingFee.toLocaleString("vi-VN")} đ`}
									</span>
								</div>
								<div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3 mt-3">
									<span>Tổng cộng:</span>
									<span className="text-primary">{total.toLocaleString("vi-VN")} đ</span>
								</div>
							</div>

							<button
								onClick={() => navigate("/checkout")}
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