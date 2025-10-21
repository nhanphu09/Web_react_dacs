import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

export default function ProductDetail() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!id) return;
		api
			.get(`/products/${id}`)
			.then((r) => setProduct(r.data))
			.catch(() => {});
	}, [id]);

	const addToCart = () => {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const exist = cart.find((i) => i.product === id);
		if (exist) exist.qty = Number(exist.qty) + Number(qty);
		else
			cart.push({
				product: id,
				title: product.title,
				price: product.price,
				qty: Number(qty),
			});
		localStorage.setItem("cart", JSON.stringify(cart));
		navigate("/cart");
	};

	const postReview = async () => {
		try {
			await api.post(`/products/${id}/reviews`, {
				rating,
				comment,
				userId: "client",
				name: "You",
			});
			alert("Review posted successfully!");
			const r = await api.get(`/products/${id}`);
			setProduct(r.data);
			setComment("");
		} catch (e) {
			alert("Failed to post review");
		}
	};

	if (!product)
		return <div className="p-6 text-center text-gray-500">Loading...</div>;

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
			{/* Thông tin sản phẩm */}
			<div className="grid md:grid-cols-2 gap-8">
				{/* Ảnh */}
				<div className="bg-gray-100 rounded-lg flex items-center justify-center h-96 overflow-hidden">
					{product.image ? (
						<img
							src={product.image}
							alt={product.title}
							className="object-contain w-full h-full hover:scale-105 transition-transform"
						/>
					) : (
						<span className="text-gray-400">No Image</span>
					)}
				</div>

				{/* Chi tiết */}
				<div>
					<h2 className="text-3xl font-bold text-gray-800 mb-2">
						{product.title}
					</h2>
					<p className="text-gray-500 mb-1">
						{product.brand} — {product.category}
					</p>
					<p className="text-blue-600 text-3xl font-semibold mb-4">
						{product.price ? `$${product.price}` : "N/A"}
					</p>
					<p className="text-gray-700 mb-6 leading-relaxed">
						{product.description}
					</p>

					{/* Số lượng */}
					<div className="flex items-center gap-3 mb-5">
						<label className="text-sm font-medium text-gray-700">
							Số lượng:
						</label>
						<input
							type="number"
							value={qty}
							min="1"
							onChange={(e) => setQty(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-1 w-20 text-center focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Nút hành động */}
					<div className="flex flex-wrap gap-4">
						<button
							onClick={addToCart}
							className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all">
							🛒 Thêm vào giỏ
						</button>
						<button
							onClick={() => navigate("/checkout")}
							className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all">
							💳 Mua ngay
						</button>
					</div>
				</div>
			</div>

			{/* Reviews */}
			<div className="mt-10 border-t pt-6">
				<h3 className="text-xl font-semibold mb-4 text-gray-800">
					Đánh giá từ khách hàng
				</h3>
				{product.reviews?.length ? (
					product.reviews.map((r, i) => (
						<div key={i} className="border-b py-3">
							<p className="font-medium text-gray-800">
								{r.name} —{" "}
								<span className="text-yellow-500">⭐ {r.rating}</span>
							</p>
							<p className="text-gray-600">{r.comment}</p>
						</div>
					))
				) : (
					<p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
				)}
			</div>

			{/* Viết review */}
			<div className="mt-10 border-t pt-6">
				<h4 className="text-lg font-semibold mb-3 text-gray-800">
					Viết đánh giá của bạn
				</h4>
				<div className="flex items-center gap-3 mb-3">
					<label className="text-sm font-medium text-gray-700">Đánh giá:</label>
					<select
						value={rating}
						onChange={(e) => setRating(e.target.value)}
						className="border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500">
						{[5, 4, 3, 2, 1].map((n) => (
							<option key={n} value={n}>
								{n} sao
							</option>
						))}
					</select>
				</div>
				<textarea
					rows="3"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className="border border-gray-300 rounded-md w-full p-3 mb-3 focus:ring-2 focus:ring-blue-500"
					placeholder="Nhập nội dung đánh giá..."
				/>
				<button
					onClick={postReview}
					className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all">
					Gửi đánh giá
				</button>
			</div>
		</div>
	);
}
