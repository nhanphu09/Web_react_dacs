import { Check, ChevronRight, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // <--- Thêm useNavigate
import { toast } from "react-toastify";
import api from "../api/client";
import QuantityInput from "../components/QuantityInput";

export default function ProductDetail() {
	const { id } = useParams();
	const navigate = useNavigate(); // <--- Hook chuyển trang
	const [product, setProduct] = useState(null);
	const [related, setRelated] = useState([]);
	const [qty, setQty] = useState(1);
	const [loading, setLoading] = useState(true);

	// ... (Giữ nguyên phần useEffect fetch data) ...
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const { data } = await api.get(`/products/${id}`);
				setProduct(data);

				// Fetch related products (nếu có API)
				try {
					const relatedRes = await api.get(`/products/${id}/related`);
					setRelated(relatedRes.data);
				} catch (e) { console.log("No related products"); }

			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
		window.scrollTo(0, 0);
	}, [id]);

	// Hàm thêm vào giỏ (Logic gốc + Logic Mua ngay)
	const addToCart = (isBuyNow = false) => {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const existItem = cart.find((x) => x.product === product._id);

		if (existItem) {
			existItem.qty += qty;
		} else {
			cart.push({
				product: product._id,
				title: product.title,
				image: product.images?.[0] || product.image,
				price: product.price,
				qty,
			});
		}
		localStorage.setItem("cart", JSON.stringify(cart));
		window.dispatchEvent(new Event("storage")); // Cập nhật Header

		// Nếu là Mua ngay thì không hiện thông báo, chuyển trang luôn
		if (isBuyNow) {
			navigate("/checkout");
		} else {
			toast.success(`Đã thêm ${qty} sản phẩm vào giỏ!`);
		}
	};

	if (loading) return <div className="p-10 text-center">Đang tải...</div>;
	if (!product) return <div className="p-10 text-center">Sản phẩm không tồn tại</div>;

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8">
			{/* Breadcrumb */}
			<div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
				<Link to="/" className="hover:text-primary">Trang chủ</Link>
				<ChevronRight size={14} />
				<Link to="/products" className="hover:text-primary">Sản phẩm</Link>
				<ChevronRight size={14} />
				<span className="text-gray-900 font-medium truncate">{product.title}</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				{/* Phần Ảnh giữ nguyên */}
				<div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-center h-[400px]">
					<img
						src={product.images && product.images.length > 0 ? product.images[0] : product.image}
						alt={product.title}
						className="max-h-full max-w-full object-contain hover:scale-105 transition duration-300"
					/>
				</div>

				{/* Phần Thông tin bên phải */}
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

					{/* Rating & Sold */}
					<div className="flex items-center gap-4 mb-4">
						<div className="flex text-yellow-400">
							{[...Array(5)].map((_, i) => (
								<Star key={i} size={18} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} className={i < Math.round(product.rating || 0) ? "" : "text-gray-300"} />
							))}
						</div>
						<span className="text-sm text-gray-500">({product.numReviews} đánh giá) | Đã bán: {product.sold}</span>
					</div>

					<p className="text-3xl font-bold text-primary mb-6">
						{product.price?.toLocaleString("vi-VN")} đ
					</p>

					{/* Khuyến mãi */}
					{product.promotions && product.promotions.length > 0 && (
						<div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
							<h3 className="font-bold text-red-600 mb-2 flex items-center gap-2">
								<Truck size={18} /> Khuyến mãi đặc biệt
							</h3>
							<ul className="space-y-1">
								{product.promotions.map((promo, i) => (
									<li key={i} className="text-sm text-gray-700 flex items-start gap-2">
										<Check size={16} className="text-green-500 mt-0.5" />
										{promo}
									</li>
								))}
							</ul>
						</div>
					)}

					{/* 👇 SỬA PHẦN NÚT BẤM Ở ĐÂY */}
					<div className="flex items-center gap-4 mb-8">
						<QuantityInput value={qty} onChange={setQty} onDecrease={() => qty > 1 && setQty(qty - 1)} onIncrease={() => setQty(qty + 1)} />

						{/* Nút Thêm vào giỏ (Màu xám/đen) */}
						<button
							onClick={() => addToCart(false)}
							className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
						>
							Thêm vào giỏ
						</button>

						{/* Nút Mua ngay (Màu đỏ/Primary - Nổi bật hơn) */}
						<button
							onClick={() => addToCart(true)}
							className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-red-600 transition shadow-lg shadow-red-200"
						>
							Mua ngay
						</button>

						{/* Nút Yêu thích */}
						<button
							onClick={async () => {
								try {
									const token = localStorage.getItem("token");
									if (!token) {
										toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
										navigate("/login");
										return;
									}
									await api.post(
										"/users/wishlist",
										{ productId: product._id },
										{ headers: { Authorization: `Bearer ${token}` } }
									);
									toast.success("Đã thêm vào yêu thích!");
								} catch (error) {
									toast.error(error.response?.data?.message || "Lỗi thêm yêu thích");
								}
							}}
							className="bg-white border border-gray-300 text-gray-500 p-3 rounded-lg hover:bg-gray-50 transition"
							title="Thêm vào yêu thích"
						>
							<Star size={24} />
						</button>
					</div>

					{/* Thông số kỹ thuật */}
					{product.specs && product.specs.length > 0 && (
						<div className="border rounded-xl overflow-hidden">
							<div className="bg-gray-100 px-4 py-2 font-bold text-gray-700">Thông số kỹ thuật</div>
							<table className="w-full text-sm">
								<tbody>
									{product.specs.map((spec, index) => (
										<tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
											<td className="p-3 text-gray-500 font-medium w-1/3 border-b">{spec.key}</td>
											<td className="p-3 text-gray-900 border-b">{spec.value}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{/* Mô tả, Đánh giá & Sản phẩm liên quan */}
			<div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Cột trái: Mô tả */}
				<div className="lg:col-span-2 space-y-8">
					<div className="bg-white rounded-xl shadow-sm p-6 border">
						<h2 className="text-xl font-bold mb-4 border-b pb-2">Mô tả sản phẩm</h2>
						<div className="prose max-w-none text-gray-700 leading-relaxed">
							{product.description || "Chưa có mô tả chi tiết."}
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm p-6 border">
						<h2 className="text-xl font-bold mb-6">Đánh giá khách hàng</h2>
						{product.reviews && product.reviews.length === 0 ? (
							<p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
						) : (
							<div className="space-y-6">
								{product.reviews?.map((r) => (
									<div key={r._id} className="border-b last:border-0 pb-6 last:pb-0">
										<div className="flex items-center justify-between mb-2">
											<p className="font-bold text-gray-800">{r.name}</p>
											<div className="flex text-yellow-400">
												{[...Array(5)].map((_, i) => (
													<Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-gray-300"} />
												))}
											</div>
										</div>
										<p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{r.comment}</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Cột phải: Sản phẩm liên quan */}
				<div className="lg:col-span-1">
					<div className="sticky top-24">
						<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
							<span className="w-1 h-6 bg-primary rounded-full block"></span>
							Sản phẩm liên quan
						</h3>

						{related.length === 0 ? (
							<p className="text-gray-500 text-sm">Không có sản phẩm tương tự.</p>
						) : (
							<div className="grid grid-cols-1 gap-4">
								{related.map((item) => (
									<Link
										to={`/product/${item._id}`}
										key={item._id}
										className="group flex gap-4 bg-white p-3 rounded-xl border hover:shadow-md transition"
									>
										<div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
											<img
												src={item.images?.[0] || item.image}
												alt={item.title}
												className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="font-medium text-gray-800 truncate group-hover:text-primary transition">
												{item.title}
											</h4>
											<p className="text-red-500 font-bold mt-1">
												{item.price?.toLocaleString("vi-VN")} đ
											</p>
											<div className="flex items-center gap-1 mt-1">
												<Star size={12} fill="currentColor" className="text-yellow-400" />
												<span className="text-xs text-gray-500">{item.rating || 0}</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}