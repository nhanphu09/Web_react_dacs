import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { ShoppingCart } from "lucide-react"; // Thêm icon cho đẹp (tùy chọn)

export default function ProductCard({ product, tag }) {
	const navigate = useNavigate();

	// Hàm xử lý Mua ngay
	const handleBuyNow = (e) => {
		e.preventDefault(); // Ngăn chặn hành vi click của Link bao ngoài (nếu có)
		e.stopPropagation();

		// 1. Logic thêm vào giỏ hàng
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const exist = cart.find((i) => i.product === product._id);

		if (exist) {
			exist.qty = Number(exist.qty) + 1;
		} else {
			cart.push({
				product: product._id,
				title: product.title,
				price: product.price,
				// Xử lý ảnh: ưu tiên lấy ảnh đầu tiên trong mảng hoặc ảnh đơn
				image: product.images?.[0] || product.image,
				qty: 1,
			});
		}

		// 2. Lưu vào LocalStorage
		localStorage.setItem("cart", JSON.stringify(cart));

		// 3. Dispatch sự kiện để Header cập nhật số lượng (nếu cần)
		window.dispatchEvent(new Event("storage"));

		// 4. Chuyển hướng ngay sang Checkout (Bỏ qua Toast thông báo)
		navigate("/checkout");
	};

	return (
		<div className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200 p-4 flex flex-col h-full overflow-hidden">
			{/* Phần hiển thị Tag */}
			{tag && (
				<div
					className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded z-10 ${tag === "Mới nhất" ? "bg-blue-500" : "bg-red-500"
						}`}>
					{tag}
				</div>
			)}

			{/* Ảnh sản phẩm - BẤM VÀO LÀ RA CHI TIẾT */}
			<Link to={`/product/${product._id}`} className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-3 cursor-pointer">
				{product.image || (product.images && product.images.length > 0) ? (
					<img
						src={product.images?.[0] || product.image}
						alt={product.title}
						className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
					/>
				) : (
					<span className="text-gray-400">No Image</span>
				)}
			</Link>

			{/* Thông tin sản phẩm */}
			<div className="text-center flex-1 flex flex-col">
				<Link to={`/product/${product._id}`} className="hover:text-primary transition">
					<h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
						{product.title}
					</h3>
				</Link>

				<p className="text-sm text-gray-500 mb-1">
					{product.brand?.name || "No Brand"}
				</p>

				<p className="text-primary font-bold text-lg mb-1">
					{product.price
						? product.price.toLocaleString("vi-VN", {
							style: "currency",
							currency: "VND",
						})
						: "Liên hệ"}
				</p>

				<p className="text-sm text-gray-500 mb-3">
					⭐ {product.rating ?? 0} ({product.numReviews ?? 0} đánh giá)
				</p>
			</div>

			{/* BUTTON MUA NGAY (Hiện lên khi hover) */}
			<div
				className="absolute bottom-4 left-4 right-4 transition-all duration-300 transform
                          opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
			>
				<button
					onClick={handleBuyNow}
					className="w-full bg-primary text-white py-2 rounded-md font-bold hover:bg-secondary transition shadow-lg flex items-center justify-center gap-2"
				>
					<ShoppingCart size={18} />
					Mua ngay
				</button>
			</div>
		</div>
	);
}