import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductCard({ product, tag }) {
	const [isAdded, setIsAdded] = useState(false);

	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const exist = cart.find((i) => i.product === product._id);

		if (exist) {
			exist.qty = Number(exist.qty) + 1;
		} else {
			cart.push({
				product: product._id,
				title: product.title,
				price: product.price,
				image: product.image,
				qty: 1,
			});
		}
		localStorage.setItem("cart", JSON.stringify(cart));
		toast.success("Đã thêm vào giỏ hàng!");

		setIsAdded(true);
		setTimeout(() => {
			setIsAdded(false);
		}, 1500);
	};

	return (
		<div className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200 p-4 flex flex-col h-full">
			{/* Phần hiển thị Tag */}
			{tag && (
				<div
					className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded z-10 ${
						tag === "Mới nhất" ? "bg-blue-500" : "bg-red-500"
					}`}>
					{tag}
				</div>
			)}

			{/* Ảnh sản phẩm */}
			<div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
				{product.image ? (
					<img
						src={product.image}
						alt={product.title}
						className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<span className="text-gray-400">No Image</span>
				)}
			</div>

			{/* Căn giữa */}
			<div className="text-center">
				<h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
					{product.title}
				</h3>
				<p className="text-sm text-gray-500 mb-1">
					{product.brand?.name || "No Brand"} —{" "}
					{product.category?.name || "No Category"}
				</p>
				<p className="text-primary font-semibold mb-1">
					{product.price
						? product.price.toLocaleString("vi-VN", {
								style: "currency",
								currency: "VND",
						  })
						: "N/A"}
				</p>
				<p className="text-sm text-gray-500 mb-3">
					⭐ {product.rating ?? 0} ({product.numReviews ?? 0} reviews)
				</p>
			</div>

			{/* Buttons */}
			<div
				className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 transition-all duration-300 transform
                          opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
				<Link
					to={`/product/${product._id}`}
					className="inline-block text-center bg-gray-200 text-gray-800 px-3 py-2 rounded-md font-medium hover:bg-gray-300 transition text-sm">
					View Details
				</Link>
				<button
					onClick={handleAddToCart}
					className={`inline-block text-center px-3 py-2 rounded-md font-medium transition text-sm ${
						isAdded
							? "bg-green-500 text-white cursor-not-allowed"
							: "bg-primary text-white hover:bg-secondary"
					}`}
					disabled={isAdded}>
					{isAdded ? "✔ Added!" : "Add to Cart"}
				</button>
			</div>
		</div>
	);
}
