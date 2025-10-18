import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
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
				{product.brand} — {product.category}
			</p>
			<p className="text-primary font-semibold mb-1">
				{product.price ? `$${product.price}` : "N/A"}
			</p>
			<p className="text-sm text-gray-500 mb-3">
				⭐ {product.rating ?? 0} ({product.numReviews ?? 0} reviews)
			</p>

			{/* Nút xem chi tiết */}
			<Link
				to={`/product/${product._id}`}
				className="mt-auto inline-block text-center bg-primary text-white px-3 py-2 rounded-md font-medium hover:bg-secondary transition">
				View Details
			</Link>
		</div>
	);
}
