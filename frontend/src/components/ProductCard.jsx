import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingBag, ShoppingCart } from "lucide-react"; // Thêm icon

export default function ProductCard({ product, tag }) {
	const navigate = useNavigate();
	const [isAdded, setIsAdded] = useState(false);

	// Hàm chung để thêm vào LocalStorage (Dùng cho cả 2 nút)
	const addToLocalStorage = () => {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const exist = cart.find((i) => i.product === product._id);

		if (exist) {
			exist.qty = Number(exist.qty) + 1;
		} else {
			cart.push({
				product: product._id,
				title: product.title,
				price: product.price,
				image: product.images?.[0] || product.image,
				qty: 1,
			});
		}
		localStorage.setItem("cart", JSON.stringify(cart));
		window.dispatchEvent(new Event("storage")); // Cập nhật Header
	};

	// 1. Logic nút "Thêm vào giỏ" (Giữ nguyên: Toast + Ở lại trang)
	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();

		addToLocalStorage();

		toast.success("Đã thêm vào giỏ hàng!");
		setIsAdded(true);
		setTimeout(() => setIsAdded(false), 1500);
	};

	// 2. Logic nút "Mua ngay" (Mới: Chuyển trang ngay)
	const handleBuyNow = (e) => {
		e.preventDefault();
		e.stopPropagation();

		addToLocalStorage();

		// Chuyển hướng ngay lập tức
		navigate("/checkout");
	};

	return (
		<div className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200 p-4 flex flex-col h-full overflow-hidden">
			{/* Tag (Mới/Hot...) */}
			{tag && (
				<div className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded z-10 ${tag === "Mới nhất" ? "bg-blue-500" : "bg-red-500"
					}`}>
					{tag}
				</div>
			)}

			{/* ẢNH SẢN PHẨM: Bấm vào ra chi tiết */}
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

			{/* THÔNG TIN */}
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
					{product.price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "Liên hệ"}
				</p>

				<p className="text-sm text-gray-500 mb-3">
					⭐ {product.rating ?? 0} ({product.numReviews ?? 0} đánh giá)
				</p>
			</div>

			{/* HAI NÚT BẤM (Hiển thị khi hover) */}
			<div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 transition-all duration-300 transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
				{/* Nút 1: Mua ngay (Thay thế View Details) - Màu Đỏ nổi bật */}
				<button
					onClick={handleBuyNow}
					className="flex items-center justify-center gap-1 bg-primary text-white py-2 rounded-md font-bold hover:bg-red-600 transition text-sm shadow-md"
				>
					<ShoppingBag size={16} /> Mua ngay
				</button>

				{/* Nút 2: Thêm giỏ (Giữ nguyên) - Màu Xám hoặc Đen */}
				<button
					onClick={handleAddToCart}
					disabled={isAdded}
					className={`flex items-center justify-center gap-1 py-2 rounded-md font-bold transition text-sm shadow-md ${isAdded
							? "bg-green-500 text-white cursor-not-allowed"
							: "bg-gray-800 text-white hover:bg-gray-700"
						}`}
				>
					{isAdded ? (
						<span>✔ Đã thêm</span>
					) : (
						<>
							<ShoppingCart size={16} /> Thêm giỏ
						</>
					)}
				</button>
			</div>
		</div>
	);
}