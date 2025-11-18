import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { FaMobileAlt, FaTshirt } from "react-icons/fa";
import { GiPerfumeBottle, GiSonicShoes } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";
import { MdOutlineComputer, MdOutlineFastfood } from "react-icons/md";
import {
	SiApple,
	SiCocacola,
	SiNike,
	SiOppo,
	SiSamsung,
	SiSony,
} from "react-icons/si";

import {
	Headset,
	LayoutGrid,
	ShieldCheck,
	Sparkles,
	Tag,
	Truck,
	Zap,
} from "lucide-react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

// SkeletonCard component
const SkeletonCard = () => (
	<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 animate-pulse w-64 flex-none">
		<div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
		<div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
		<div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
		<div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
		<div className="h-10 bg-gray-200 rounded-md mt-3"></div>
	</div>
);

const getIcon = (name, type = "category") => {
	const lowerName = name.toLowerCase();
	if (type === "brand") {
		if (lowerName.includes("apple")) return <SiApple size={32} />;
		if (lowerName.includes("samsung")) return <SiSamsung size={32} />;
		if (lowerName.includes("oppo")) return <SiOppo size={32} />;
		if (lowerName.includes("sony")) return <SiSony size={32} />;
		if (lowerName.includes("coca-cola")) return <SiCocacola size={32} />;
		if (lowerName.includes("nike")) return <SiNike size={32} />;
		return <Tag size={32} />;
	}
	if (lowerName.includes("máy tính")) return <MdOutlineComputer size={32} />;
	if (lowerName.includes("điện thoại")) return <FaMobileAlt size={32} />;
	if (lowerName.includes("quần áo")) return <FaTshirt size={32} />;
	if (lowerName.includes("chăm sóc")) return <GiPerfumeBottle size={32} />;
	if (lowerName.includes("thực phẩm")) return <MdOutlineFastfood size={32} />;
	if (lowerName.includes("giày dép")) return <GiSonicShoes size={32} />;
	return <IoSparkles size={32} />;
};

export default function Home() {
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	const [bestSellers, setBestSellers] = useState([]);
	const [hotElectronics, setHotElectronics] = useState([]);

	useEffect(() => {
		const fetchCoreData = async () => {
			try {
				setLoading(true);
				const [productRes, categoryRes, brandRes, bestSellerRes] =
					await Promise.all([
						api.get("/products?limit=10&sort=createdAt_desc"),
						api.get("/categories"),
						api.get("/brands"),
						api.get("/products?limit=10&sort=sold_desc"),
					]);
				setFeaturedProducts(productRes.data.products);
				setCategories(categoryRes.data);
				setBrands(brandRes.data);
				setBestSellers(bestSellerRes.data.products);
			} catch (err) {
				console.error("Failed to fetch core data", err);
			} finally {
				setLoading(false);
			}
		};
		fetchCoreData();
	}, []);

	useEffect(() => {
		if (categories.length === 0) return;
		const fetchHotElectronics = async () => {
			try {
				const electronicsCat = categories.find((c) => c.name === "Điện tử");
				if (!electronicsCat) return;
				const res = await api.get(
					`/products?limit=8&category=${electronicsCat._id}&sort=sold_desc`
				);
				setHotElectronics(res.data.products);
			} catch (err) {
				console.error("Failed to fetch hot electronics", err);
			}
		};
		fetchHotElectronics();
	}, [categories]);

	const renderCategoryCarousel = (items, type) => (
		<Swiper
			modules={[Navigation]}
			navigation
			spaceBetween={16}
			slidesPerView={2.5}
			breakpoints={{
				640: { slidesPerView: 4 },
				768: { slidesPerView: 5 },
				1024: { slidesPerView: 7 },
			}}
			className="!pb-4">
			{items.map((item) => (
				<SwiperSlide key={item._id}>
					<Link
						to={`/products?${type}=${item._id}`}
						className="group flex flex-col items-center justify-center p-4 h-28 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-primary hover:shadow-lg hover:border-transparent transition-all duration-300 transform hover:-translate-y-1">
						<div className="text-gray-500 group-hover:text-white mb-2 transition-colors">
							{getIcon(item.name, type)}
						</div>
						<span className="font-semibold text-gray-800 group-hover:text-white text-center text-sm">
							{item.name}
						</span>
					</Link>
				</SwiperSlide>
			))}
		</Swiper>
	);

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* 1. HERO BANNER */}
			<div className="max-w-7xl mx-auto px-4 pt-4 md:pt-10">
				<div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
					<img
						src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
						alt="Shop Banner"
						className="w-full h-full object-cover opacity-50"
					/>
					<div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 md:p-6">
						{/* Chỉnh font size responsive: text-2xl trên mobile, text-5xl trên PC */}
						<h1 className="text-2xl md:text-5xl font-extrabold mb-2 md:mb-4 shadow-md">
							Chào mừng tới PKA<span className="text-secondary">Shop</span> 🛒
						</h1>
						<p className="text-sm md:text-xl text-gray-200 mb-4 md:mb-8 shadow-sm">
							Khám phá các sản phẩm mới nhất và danh mục nổi bật.
						</p>
						<Link
							to="/products"
							className="inline-block bg-primary text-white px-6 py-2 md:px-8 md:py-3 rounded-md font-semibold text-sm md:text-lg hover:bg-secondary transition-all duration-300 shadow-lg transform hover:scale-105">
							Xem tất cả sản phẩm
						</Link>
					</div>
				</div>
			</div>

			{/* 2. KHU VỰC TÍNH NĂNG (SỬA LỖI GIAO DIỆN MOBILE) */}
			<div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
				{/* 🟢 QUAN TRỌNG: grid-cols-1 trên mobile, md:grid-cols-3 trên desktop */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
						<Truck size={40} className="text-primary flex-shrink-0" />
						<div>
							<h3 className="font-bold text-lg text-gray-800">
								Giao hàng miễn phí
							</h3>
							<p className="text-sm text-gray-600">
								Cho tất cả đơn hàng trên 500.000đ
							</p>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
						<Headset size={40} className="text-primary flex-shrink-0" />
						<div>
							<h3 className="font-bold text-lg text-gray-800">Hỗ trợ 24/7</h3>
							<p className="text-sm text-gray-600">
								Luôn sẵn sàng giải đáp thắc mắc
							</p>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
						<ShieldCheck size={40} className="text-primary flex-shrink-0" />
						<div>
							<h3 className="font-bold text-lg text-gray-800">
								Thanh toán an toàn
							</h3>
							<p className="text-sm text-gray-600">Bảo mật thông tin 100%</p>
						</div>
					</div>
				</div>
			</div>

			{/* 3. KHÁM PHÁ DANH MỤC */}
			<div className="max-w-7xl mx-auto mt-12 px-4">
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center gap-2">
						<LayoutGrid className="text-primary" /> Khám phá Danh mục
					</h2>
					{loading ? (
						<p className="text-center text-gray-500">Đang tải danh mục...</p>
					) : (
						renderCategoryCarousel(categories, "category")
					)}
				</div>
			</div>

			{/* 4. SẢN PHẨM MỚI NHẤT */}
			<div className="max-w-7xl mx-auto px-4 mt-12">
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center gap-2">
						<Sparkles className="text-primary" /> Sản phẩm Mới nhất
					</h2>
					{loading ? (
						<div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin">
							{[1, 2, 3, 4].map((n) => (
								<SkeletonCard key={n} />
							))}
						</div>
					) : (
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
							{featuredProducts.map((p) => (
								<SwiperSlide key={p._id} className="h-full">
									<ProductCard product={p} tag="Mới nhất" />
								</SwiperSlide>
							))}
						</Swiper>
					)}
				</div>
			</div>

			{/* 5. BANNERS QUẢNG CÁO */}
			<div className="max-w-7xl mx-auto px-4 mt-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Link
						to="/products"
						className="block rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02]">
						<img
							src="https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/img_5_b694eea967.png"
							alt="Banner 1"
							className="w-full h-full object-cover"
						/>
					</Link>
					<Link
						to="/products"
						className="block rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02]">
						<img
							src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=60"
							alt="Banner 2"
							className="w-full h-full object-cover"
						/>
					</Link>
				</div>
			</div>

			{/* 6. SẢN PHẨM NỔI BẬT (THEO DANH MỤC) */}
			{!loading && hotElectronics.length > 0 && (
				<div className="max-w-7xl mx-auto px-4 mt-12">
					<div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center gap-2">
							<Zap className="text-primary" /> ⚡ Điện tử Nổi bật
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
							{hotElectronics.map((p) => (
								<SwiperSlide key={p._id} className="h-full">
									<ProductCard product={p} tag="Hot" />
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			)}

			{/* 7. SẢN PHẨM BÁN CHẠY */}
			<div className="max-w-7xl mx-auto px-4 mt-12">
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center gap-2">
						🔥 Sản phẩm Bán chạy
					</h2>
					{loading ? (
						<div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin">
							{[1, 2, 3, 4].map((n) => (
								<SkeletonCard key={n} />
							))}
						</div>
					) : (
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
							{bestSellers.map((p) => (
								<SwiperSlide key={p._id} className="h-full">
									<ProductCard product={p} tag="Bán chạy" />
								</SwiperSlide>
							))}
						</Swiper>
					)}
				</div>
			</div>

			{/* 8. KHÁM PHÁ THƯƠNG HIỆU */}
			<div className="max-w-7xl mx-auto mt-12 px-4">
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center gap-2">
						<Tag className="text-primary" /> Khám phá Thương hiệu
					</h2>
					{loading ? (
						<p className="text-center text-gray-500">Đang tải thương hiệu...</p>
					) : (
						renderCategoryCarousel(brands, "brand")
					)}
				</div>
			</div>
		</div>
	);
}
