import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";

export default function Checkout() {
	const [address, setAddress] = useState({
		name: "",
		line1: "",
		city: "",
		postal: "",
	});
	const [paymentMethod, setPaymentMethod] = useState("COD");
	const navigate = useNavigate();

	const cart = JSON.parse(localStorage.getItem("cart") || "[]");
	const itemsPrice = cart.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
	const shipping = itemsPrice > 100 ? 0 : 10;
	const total = itemsPrice + shipping;

	const placeOrder = async () => {
		if (cart.length === 0) {
			alert("Your cart is empty!");
			return;
		}
		try {
			const order = {
				userId: "client",
				orderItems: cart.map((it) => ({
					product: it.product,
					qty: it.qty,
					price: it.price,
				})),
				shippingAddress: address,
				paymentMethod,
				itemsPrice,
				shippingPrice: shipping,
				totalPrice: total,
			};

			await axios.post("/orders", order);
			alert("✅ Order placed successfully!");
			localStorage.removeItem("cart");
			navigate("/orders");
		} catch (e) {
			alert("❌ Order failed. Please try again.");
		}
	};

	return (
		<div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl animate-fade-in">
			<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
				🧾 Checkout
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Thông tin giao hàng */}
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Shipping Information
					</h3>

					<div className="space-y-4">
						{["name", "line1", "city", "postal"].map((field, i) => (
							<input
								key={i}
								type="text"
								placeholder={
									field === "name"
										? "Full name"
										: field === "line1"
										? "Address line"
										: field === "city"
										? "City"
										: "Postal code"
								}
								value={address[field]}
								onChange={(e) =>
									setAddress({ ...address, [field]: e.target.value })
								}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
							/>
						))}
					</div>

					<h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">
						Payment Method
					</h3>
					<select
						value={paymentMethod}
						onChange={(e) => setPaymentMethod(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none">
						<option value="COD">Cash on Delivery (COD)</option>
						<option value="Bank Transfer">Bank Transfer</option>
						<option value="E-Wallet">E-Wallet (Momo, ZaloPay...)</option>
					</select>
				</div>

				{/* Tóm tắt đơn hàng */}
				<div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-gray-50">
					<h3 className="text-lg font-semibold mb-4 text-gray-700">
						Order Summary
					</h3>

					<div className="space-y-2 text-gray-700">
						<p>
							Items:{" "}
							<span className="font-medium text-gray-900">
								${itemsPrice.toFixed(2)}
							</span>
						</p>
						<p>
							Shipping:{" "}
							<span className="font-medium text-gray-900">
								{shipping === 0 ? "Free" : `$${shipping}`}
							</span>
						</p>
						<hr className="my-3" />
						<p className="text-xl font-bold">
							Total: <span className="text-primary">${total.toFixed(2)}</span>
						</p>
					</div>

					<button
						onClick={placeOrder}
						className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-secondary transition-all duration-300">
						Place Order
					</button>
				</div>
			</div>
		</div>
	);
}
