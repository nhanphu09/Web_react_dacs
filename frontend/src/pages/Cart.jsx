import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
	const [cart, setCart] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("cart") || "[]");
		setCart(stored);
	}, []);

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
	const shipping = subtotal > 100 ? 0 : 10;
	const total = subtotal + shipping;

	return (
		<div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
			<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
				🛒 Giỏ hàng của bạn
			</h2>

			{/* Nếu giỏ hàng trống */}
			{cart.length === 0 ? (
				<div className="text-center py-20 text-gray-500">
					<p className="text-lg mb-4">Giỏ hàng của bạn đang trống.</p>
					<button
						onClick={() => navigate("/products")}
						className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
						🛍️ Tiếp tục mua sắm
					</button>
				</div>
			) : (
				<>
					{/* Danh sách sản phẩm */}
					<div className="space-y-5">
						{cart.map((item, index) => (
							<div
								key={index}
								className="flex flex-col md:flex-row items-center justify-between border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition">
								{/* Thông tin sản phẩm */}
								<div className="flex items-center gap-5 flex-1">
									{/* Ảnh */}
									<div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
										{item.image ? (
											<img
												src={item.image}
												alt={item.title}
												className="object-contain w-full h-full"
											/>
										) : (
											<span className="text-gray-400 text-sm">No Image</span>
										)}
									</div>

									{/* Chi tiết */}
									<div>
										<p className="font-semibold text-lg text-gray-800">
											{item.title}
										</p>
										<p className="text-gray-600 text-sm">
											Giá:{" "}
											<span className="text-blue-600 font-medium">
												${item.price}
											</span>
										</p>
										{item.size && (
											<p className="text-gray-500 text-sm">
												Size: <span className="font-medium">{item.size}</span>
											</p>
										)}
									</div>
								</div>

								{/* Số lượng và nút xóa */}
								<div className="flex items-center gap-4 mt-4 md:mt-0">
									<div className="flex items-center gap-2">
										<label className="text-sm text-gray-700">SL:</label>
										<input
											type="number"
											min="1"
											value={item.qty}
											onChange={(e) => updateQty(index, e.target.value)}
											className="w-16 border rounded-md px-2 py-1 text-center focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<button
										onClick={() => removeItem(index)}
										className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition">
										Xóa
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Tổng kết */}
					<div className="mt-10 border-t pt-6 flex flex-col items-end">
						<div className="bg-gray-50 p-6 rounded-lg shadow-inner w-full md:w-1/2">
							<p className="text-gray-700">
								Tạm tính:{" "}
								<span className="font-semibold text-gray-900">
									${subtotal.toFixed(2)}
								</span>
							</p>
							<p className="text-gray-700">
								Vận chuyển:{" "}
								<span className="font-semibold text-gray-900">
									{shipping === 0 ? "Miễn phí" : `$${shipping}`}
								</span>
							</p>
							<p className="text-xl font-bold mt-3">
								Tổng cộng:{" "}
								<span className="text-blue-600">${total.toFixed(2)}</span>
							</p>

							<div className="mt-6 flex justify-end gap-3">
								<button
									onClick={() => navigate("/products")}
									className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition">
									⬅️ Tiếp tục mua sắm
								</button>
								<button
									onClick={() => navigate("/checkout")}
									className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
									Thanh toán 💳
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
