import { Check, ChevronRight, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";
import QuantityInput from "../components/QuantityInput";

export default function ProductDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [related, setRelated] = useState([]);
	const [qty, setQty] = useState(1);
	const [loading, setLoading] = useState(true);

	// 👇 THÊM STATE ĐỂ LƯU LỰA CHỌN PHIÊN BẢN VÀ MÀU SẮC
	const [selectedVersion, setSelectedVersion] = useState("256GB");
	const [selectedColor, setSelectedColor] = useState("Cam Vũ Trụ");

	// Dữ liệu mẫu (Tạm thời cứng để test giao diện, sau này có thể lấy từ product API)
	const versions = ["1TB", "512GB", "256GB"];
	const colors = [
		{ name: "Xanh Đậm", price: 34990000, img: "https://placehold.co/150x150/000080/FFF?text=Xanh" },
		{ name: "Cam Vũ Trụ", price: 34990000, img: "https://placehold.co/150x150/FF8C00/FFF?text=Cam" },
		{ name: "Bạc", price: 34990000, img: "https://placehold.co/150x150/C0C0C0/FFF?text=Bac" },
	];

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const { data } = await api.get(`/products/${id}`);
				setProduct(data);

				// Nạp ảnh thực tế của sản phẩm vào mảng màu nếu có
				if (data.image) {
					colors.forEach(c => c.img = data.images?.[0] || data.image);
				}

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const addToCart = (isBuyNow = false) => {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");

		// Cập nhật lại logic tìm kiếm trong giỏ: 
		// Phải phân biệt iPhone 256GB Đen với iPhone 512GB Đen (chúng là 2 dòng khác nhau trong giỏ)
		const cartItemId = `${product._id}-${selectedVersion}-${selectedColor}`;
		const existItem = cart.find((x) => x.cartItemId === cartItemId);

		const currentQtyInCart = existItem ? existItem.qty : 0;
		if (currentQtyInCart + qty > product.stock) {
			toast.error(`Rất tiếc, kho chỉ còn ${product.stock} sản phẩm!`);
			return;
		}

		if (existItem) {
			existItem.qty += qty;
		} else {
			cart.push({
				cartItemId: cartItemId, // ID mới bao gồm cả màu và bản
				product: product._id,
				// 👇 Gắn thêm Màu và Phiên bản vào tên để hiển thị ở giỏ hàng và Email
				title: `${product.title} (${selectedVersion} - ${selectedColor})`,
				image: product.images?.[0] || product.image,
				price: product.price,
				stock: product.stock,
				qty,
			});
		}
		localStorage.setItem("cart", JSON.stringify(cart));
		window.dispatchEvent(new Event("storage"));

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
			<div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
				<Link to="/" className="hover:text-primary">Trang chủ</Link>
				<ChevronRight size={14} />
				<Link to="/products" className="hover:text-primary">Sản phẩm</Link>
				<ChevronRight size={14} />
				<span className="text-gray-900 font-medium truncate">{product.title}</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				{/* ẢNH SẢN PHẨM */}
				<div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-center h-[500px] sticky top-24">
					<img
						src={product.images && product.images.length > 0 ? product.images[0] : product.image}
						alt={product.title}
						className="max-h-full max-w-full object-contain hover:scale-105 transition duration-300"
					/>
				</div>

				{/* THÔNG TIN */}
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

					{/* ========================================================= */}
					{/* 🟢 KHU VỰC CHỌN PHIÊN BẢN (MỚI THÊM) */}
					{/* ========================================================= */}
					<div className="mb-6">
						<h3 className="text-lg font-bold mb-3 text-gray-800">Phiên bản</h3>
						<div className="flex flex-wrap gap-3">
							{versions.map(ver => (
								<button
									key={ver}
									onClick={() => setSelectedVersion(ver)}
									className={`relative px-6 py-3 border rounded-lg font-bold transition-all overflow-hidden ${selectedVersion === ver
										? "border-red-600 text-red-600 bg-red-50/50"
										: "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
										}`}
								>
									{ver}
									{/* Dấu Tích Đỏ góc phải */}
									{selectedVersion === ver && (
										<div className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg px-1 py-0.5">
											<Check size={12} strokeWidth={4} />
										</div>
									)}
								</button>
							))}
						</div>
					</div>

					{/* ========================================================= */}
					{/* 🟢 KHU VỰC CHỌN MÀU SẮC (MỚI THÊM) */}
					{/* ========================================================= */}
					<div className="mb-8">
						<h3 className="text-lg font-bold mb-3 text-gray-800">Màu sắc</h3>
						<div className="flex flex-wrap gap-3">
							{colors.map(color => (
								<button
									key={color.name}
									onClick={() => setSelectedColor(color.name)}
									className={`relative flex items-center gap-3 p-2 pr-4 border rounded-lg transition-all overflow-hidden bg-white ${selectedColor === color.name
										? "border-red-600 bg-red-50/30"
										: "border-gray-300 hover:border-gray-400"
										}`}
								>
									<img src={color.img} alt={color.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
									<div className="text-left">
										<div className="font-bold text-sm text-gray-800">{color.name}</div>
										<div className="text-xs text-gray-500 font-medium">{product.price?.toLocaleString("vi-VN")}đ</div>
									</div>
									{/* Dấu Tích Đỏ góc phải */}
									{selectedColor === color.name && (
										<div className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg px-1 py-0.5">
											<Check size={12} strokeWidth={4} />
										</div>
									)}
								</button>
							))}
						</div>
					</div>
					{/* ========================================================= */}

					<p className={`mb-6 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
						{product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : "Đã hết hàng"}
					</p>

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

					{/* NÚT BẤM */}
					<div className="flex items-center gap-4 mb-8">
						{product.stock > 0 ? (
							<>
								<QuantityInput
									value={qty}
									onChange={setQty}
									onDecrease={() => qty > 1 && setQty(qty - 1)}
									onIncrease={() => {
										if (qty < product.stock) setQty(qty + 1);
										else toast.warning(`Kho chỉ còn tối đa ${product.stock} sản phẩm!`);
									}}
								/>
								<button onClick={() => addToCart(false)} className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition">
									Thêm vào giỏ
								</button>
								<button onClick={() => addToCart(true)} className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-red-600 transition shadow-lg shadow-red-200">
									Mua ngay
								</button>
							</>
						) : (
							<div className="flex-1 bg-gray-100 text-red-500 border border-red-200 text-center py-3 px-4 rounded-lg font-bold text-lg">
								Sản phẩm tạm thời hết hàng
							</div>
						)}

						<button
							onClick={async () => {
								try {
									const token = localStorage.getItem("token");
									if (!token) return toast.error("Vui lòng đăng nhập"), navigate("/login");
									await api.post("/users/wishlist", { productId: product._id }, { headers: { Authorization: `Bearer ${token}` } });
									toast.success("Đã thêm vào yêu thích!");
								} catch (error) { toast.error("Lỗi thêm yêu thích"); }
							}}
							className="bg-white border border-gray-300 text-gray-500 p-3 rounded-lg hover:bg-red-50 hover:text-red-500 transition"
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

			{/* CÁC PHẦN DƯỚI (Mô tả, Review, Sản phẩm liên quan) GIỮ NGUYÊN */}
			<div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
												{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-gray-300"} />)}
											</div>
										</div>
										<p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{r.comment}</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="lg:col-span-1">
					<div className="sticky top-24">
						<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
							<span className="w-1 h-6 bg-primary rounded-full block"></span> Sản phẩm liên quan
						</h3>
						{related.length === 0 ? (
							<p className="text-gray-500 text-sm">Không có sản phẩm tương tự.</p>
						) : (
							<div className="grid grid-cols-1 gap-4">
								{related.map((item) => (
									<Link to={`/product/${item._id}`} key={item._id} className="group flex gap-4 bg-white p-3 rounded-xl border hover:shadow-md transition">
										<div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
											<img src={item.images?.[0] || item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="font-medium text-gray-800 truncate group-hover:text-primary transition">{item.title}</h4>
											<p className="text-red-500 font-bold mt-1">{item.price?.toLocaleString("vi-VN")} đ</p>
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