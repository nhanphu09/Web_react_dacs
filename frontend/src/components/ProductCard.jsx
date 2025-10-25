import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // 🟢 1. THÊM IMPORT NÀY

export default function ProductCard({ product }) {
	// 🟢 2. THÊM HÀM NÀY VÀO
	const handleAddToCart = (e) => {
		e.preventDefault(); // Ngăn không cho Link (ở dưới) chạy
		e.stopPropagation(); // Ngăn sự kiện nổi bọt

		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const exist = cart.find((i) => i.product === product._id);

		if (exist) {
			// Nếu đã có, chỉ tăng số lượng
			exist.qty = Number(exist.qty) + 1;
		} else {
			// Nếu chưa có, thêm mới với số lượng là 1
			cart.push({
				product: product._id, // Lưu ID
				title: product.title,
				price: product.price,
				image: product.image,
				qty: 1,
			});
		}
		localStorage.setItem("cart", JSON.stringify(cart));
		toast.success("Đã thêm vào giỏ hàng!");
	};

	return (
		<div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200 p-4 flex flex-col">
			{/* Ảnh sản phẩm */}
			<div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
				{product.image ? (
					<img
						src={product.image}
						alt={product.title}
						className="object-contain w-full h-full"
					/>
				) : (
					<span className="text-gray-400">No Image</span>
				)}
			</div>

			{/* Thông tin sản phẩm */}
			<h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
				{product.title}
			</h3>
			<p className="text-sm text-gray-500 mb-1">
				{product.brand?.name || "No Brand"} —{" "}
				{product.category?.name || "No Category"}
			</p>
			<p className="text-primary font-semibold mb-1">
				{product.price ? `$${product.price}` : "N/A"}
			</p>
			<p className="text-sm text-gray-500 mb-3">
				⭐ {product.rating ?? 0} ({product.numReviews ?? 0} reviews)
			</p>

			{/*<div grid> */}
			<div className="mt-auto grid grid-cols-2 gap-2">
				<Link
					to={`/product/${product._id}`}
					className="inline-block text-center bg-gray-200 text-gray-800 px-3 py-2 rounded-md font-medium hover:bg-gray-300 transition text-sm">
					View Details
				</Link>
				<button
					onClick={handleAddToCart}
					className="inline-block text-center bg-primary text-white px-3 py-2 rounded-md font-medium hover:bg-secondary transition text-sm">
					Add to Cart
				</button>
			</div>
		</div>
	);
}
