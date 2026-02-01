import { Check, ChevronRight, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import QuantityInput from "../components/QuantityInput";

export default function ProductDetail() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [related, setRelated] = useState([]);
	const [qty, setQty] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const { data } = await api.get(`/products/${id}`);
				setProduct(data);

				// Lấy sản phẩm liên quan
				if (data.category) {
					const catId = data.category._id || data.category;
					const relatedRes = await api.get(`/products?category=${catId}&limit=4&exclude=${id}`);
					setRelated(relatedRes.data.products);
				}
			} catch (err) {
				toast.error("Lỗi khi tải sản phẩm");
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
		window.scrollTo(0, 0);
	}, [id]);

	const addToCart = () => {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const existItem = cart.find((x) => x.product === product._id);

		if (existItem) {
			existItem.qty += qty;
		} else {
			cart.push({
				product: product._id,
				title: product.title,
				image: product.image,
				price: product.price,
				qty,
			});
		}
		localStorage.setItem("cart", JSON.stringify(cart));
		toast.success(`Đã thêm ${qty} sản phẩm vào giỏ!`);
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
				{/* Ảnh sản phẩm */}
				<div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-center h-[400px]">
					<img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain hover:scale-105 transition duration-300" />
				</div>

				{/* Thông tin */}
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
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

					<div className="flex items-center gap-4 mb-8">
						<QuantityInput value={qty} onChange={setQty} onDecrease={() => qty > 1 && setQty(qty - 1)} onIncrease={() => setQty(qty + 1)} />
						<button onClick={addToCart} className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-secondary transition shadow-lg shadow-red-200">
							Thêm vào giỏ hàng
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

			{/* Mô tả & Đánh giá (Giữ nguyên) */}
			<div className="mt-12 bg-white rounded-xl shadow-sm p-6 border">
				<h2 className="text-xl font-bold mb-4 border-b pb-2">Mô tả sản phẩm</h2>
				<p className="whitespace-pre-line text-gray-700 leading-relaxed">
					{product.description || "Chưa có mô tả chi tiết."}
				</p>
			</div>

			<div className="mt-8 bg-white rounded-xl shadow-sm p-6 border">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold">Đánh giá khách hàng</h2>
					<Link to={`/review/${product._id}`} className="text-primary font-medium hover:underline">
						Viết đánh giá
					</Link>
				</div>
				{product.reviews.length === 0 ? (
					<p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
				) : (
					<div className="space-y-6">
						{product.reviews.map((r) => (
							<div key={r._id} className="border-b last:border-0 pb-6 last:pb-0">
								<div className="flex items-center justify-between mb-2">
									<p className="font-bold text-gray-800">{r.name}</p>
									<div className="flex text-yellow-400">
										{[...Array(5)].map((_, i) => (
											<Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />
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
	);
}