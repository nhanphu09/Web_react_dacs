import { CheckCircle, Star, Tag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import api from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [thumbsSwiper, setThumbsSwiper] = useState(null);
	const [relatedProducts, setRelatedProducts] = useState([]);

	const fetchProduct = () => {
		api
			.get(`/products/${id}`)
			.then((r) => setProduct(r.data))
			.catch(() => {});
	};

	useEffect(() => {
		fetchProduct();
		setRelatedProducts([]);
	}, [id]);

	useEffect(() => {
		if (product && product.category) {
			const fetchRelated = async () => {
				try {
					const res = await api.get(
						`/products?category=${product.category._id}&limit=8&exclude=${product._id}`
					);
					setRelatedProducts(res.data.products);
				} catch (err) {
					console.error("Failed to fetch related products", err);
				}
			};
			fetchRelated();
		}
	}, [product]);

	const addToCart = () => {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const exist = cart.find((i) => i.product === id);
		if (exist) exist.qty = Number(exist.qty) + Number(qty);
		else
			cart.push({
				product: id,
				title: product.title,
				price: product.price,
				image: product.image, // Thêm image
				qty: Number(qty),
			});
		localStorage.setItem("cart", JSON.stringify(cart));
		toast.success("Đã thêm vào giỏ hàng!");
	};

	const postReview = async () => {
		try {
			await api.post(`/products/${id}/reviews`, {
				rating,
				comment,
				userId: "client", // (Sẽ được thay bằng req.user ở backend)
				name: "You", // (Sẽ được thay bằng req.user.name ở backend)
			});
			toast.success("Gửi đánh giá thành công!");
			fetchProduct();
			setComment("");
		} catch (e) {
			toast.error(e.response?.data?.message || "Gửi đánh giá thất bại!");
		}
	};

	if (!product)
		return <div className="p-6 text-center text-gray-500">Loading...</div>;

	const productImages = product.images || [product.image];

	return (
		<div className="max-w-6xl mx-auto p-6 mt-10">
			{/* Phần 1: Thông tin sản phẩm */}
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<div className="grid md:grid-cols-2 gap-8">
					{/* CỘT 1 - THƯ VIỆN ẢNH */}
					<div>
						<Swiper
							modules={[FreeMode, Navigation, Thumbs]}
							spaceBetween={10}
							navigation
							thumbs={{
								swiper:
									thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
							}}
							className="rounded-lg shadow-md mb-3 border">
							{productImages.map((img, index) => (
								<SwiperSlide key={index}>
									<div className="w-full h-96 flex items-center justify-center bg-gray-100">
										<img
											src={img}
											alt={product.title}
											className="object-contain w-full h-full"
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
						<Swiper
							onSwiper={setThumbsSwiper}
							modules={[FreeMode, Thumbs]}
							spaceBetween={10}
							slidesPerView={4}
							freeMode={true}
							watchSlidesProgress={true}
							className="h-24">
							{productImages.map((img, index) => (
								<SwiperSlide
									key={index}
									className="cursor-pointer border rounded-md overflow-hidden hover:border-primary">
									<img
										src={img}
										alt="thumbnail"
										className="object-contain w-full h-full"
									/>
								</SwiperSlide>
							))}
						</Swiper>
					</div>

					{/* CỘT 2 - THÔNG TIN SẢN PHẨM */}
					<div>
						<h2 className="text-3xl font-bold text-gray-800 mb-2">
							{product.title}
						</h2>
						<p className="text-gray-500 mb-1">
							Thương hiệu:{" "}
							<span className="font-medium text-primary">
								{product.brand?.name || "Chưa rõ"}
							</span>{" "}
							| Danh mục:{" "}
							<span className="font-medium text-primary">
								{product.category?.name || "Chưa rõ"}
							</span>
						</p>
						<p className="text-primary text-3xl font-bold mb-4">
							{product.price
								? product.price.toLocaleString("vi-VN", {
										style: "currency",
										currency: "VND",
								  })
								: "N/A"}
						</p>
						<div className="mb-4">
							{product.stock > 0 ? (
								<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium text-sm w-fit">
									<CheckCircle size={16} /> Còn hàng ({product.stock})
								</span>
							) : (
								<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium text-sm w-fit">
									Hết hàng
								</span>
							)}
						</div>

						{/* HỘP KHUYẾN MÃI & MÔ TẢ */}
						<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
							<h4 className="font-bold text-lg text-primary mb-2 flex items-center gap-1">
								<Tag size={18} /> Khuyến mãi & Thông tin
							</h4>

							{product.promotions && product.promotions.length > 0 ? (
								<ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
									{product.promotions.map((promo, index) => (
										<li key={index}>{promo}</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-gray-600 italic">
									Sản phẩm hiện không có khuyến mãi.
								</p>
							)}

							{product.description && (
								<>
									<hr className="my-3 border-gray-200" />
									<p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
										{product.description}
									</p>
								</>
							)}
						</div>

						{/* Input số lượng */}
						<div className="flex items-center gap-3 mb-5">
							<label className="text-sm font-medium text-gray-700">
								Số lượng:
							</label>
							<input
								type="number"
								value={qty}
								min="1"
								max={product.stock}
								onChange={(e) => setQty(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-1 w-20 text-center focus:ring-2 focus:ring-primary"
								disabled={product.stock === 0}
							/>
						</div>

						{/* Nút bấm */}
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								onClick={addToCart}
								disabled={product.stock === 0}
								className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
								🛒 Thêm vào giỏ
							</button>
							<button
								onClick={() => {
									addToCart();
									navigate("/checkout");
								}}
								disabled={product.stock === 0}
								className="w-full border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
								💳 Mua ngay
							</button>
						</div>
					</div>
				</div>

				{/* 🟢 SỬA: KHU VỰC ĐÁNH GIÁ (FULL CODE) */}
				<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Cột 1: Hiển thị reviews */}
					<div className="border-t pt-6">
						<h3 className="text-xl font-semibold mb-4 text-gray-800">
							Đánh giá từ khách hàng ({product.reviews?.length || 0})
						</h3>
						<div className="space-y-4 max-h-96 overflow-y-auto">
							{product.reviews?.length ? (
								product.reviews.map((r, i) => (
									<div
										key={i} // 🟢 SỬA: Dùng 'i' hoặc 'r._id' nếu có
										className="border-b py-3 flex gap-3">
										<div className="bg-gray-200 p-2 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center">
											<User size={18} className="text-gray-600" />
										</div>
										<div>
											<p className="font-medium text-gray-800">{r.name}</p>
											<div className="flex items-center">
												{[...Array(5)].map((_, idx) => (
													<Star
														key={idx}
														size={16}
														className={
															idx < r.rating
																? "text-yellow-400"
																: "text-gray-300"
														}
														fill={idx < r.rating ? "currentColor" : "none"}
													/>
												))}
											</div>
											<p className="text-gray-600 mt-1">{r.comment}</p>
										</div>
									</div>
								))
							) : (
								<p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
							)}
						</div>
					</div>

					{/* Cột 2: Viết review */}
					<div className="border-t pt-6">
						<h4 className="text-xl font-semibold mb-3 text-gray-800">
							Viết đánh giá của bạn
						</h4>
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<label className="text-sm font-medium text-gray-700">
									Đánh giá:
								</label>
								<select
									value={rating}
									onChange={(e) => setRating(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary">
									{[5, 4, 3, 2, 1].map((n) => (
										<option key={n} value={n}>
											{n} sao
										</option>
									))}
								</select>
							</div>
							<textarea
								rows="4"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className="border border-gray-300 rounded-md w-full p-3 focus:ring-2 focus:ring-primary"
								placeholder="Nhập nội dung đánh giá của bạn..."
							/>
							<button
								onClick={postReview}
								className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-all">
								Gửi đánh giá
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* PHẦN SẢN PHẨM LIÊN QUAN */}
			{relatedProducts.length > 0 && (
				<div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
					<h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
						Sản phẩm liên quan
					</h2>
					<Swiper
						modules={[Navigation]}
						navigation
						spaceBetween={16}
						slidesPerView={1.5}
						breakpoints={{
							640: { slidesPerView: 2 },
							768: { slidesPerView: 3 },
							1024: { slidesPerView: 4 },
						}}
						className="!pb-4">
						{relatedProducts.map((p) => (
							<SwiperSlide key={p._id} className="h-full">
								<ProductCard product={p} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			)}
		</div>
	);
}
