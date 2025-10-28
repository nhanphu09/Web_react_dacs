import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

// 🟢 NÂNG CẤP 1: Tạo component "thẻ xương" (Skeleton Card)
const SkeletonCard = () => (
	<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 animate-pulse">
		<div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
		<div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
		<div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
		<div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
		<div className="h-10 bg-gray-200 rounded-md mt-3"></div>
	</div>
);

export default function Home() {
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]); // 🟢 NÂNG CẤP 1: Thêm state cho brand
	const [loading, setLoading] = useState(true);
	const [bestSellers, setBestSellers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [productRes, categoryRes, brandRes, bestSellerRes] =
					await Promise.all([
						api.get("/products?limit=4&sort=createdAt_desc"), // Lấy 4 sản phẩm mới nhất
						api.get("/categories"),
						api.get("/brands"), // 🟢 NÂNG CẤP 1: Tải API brands
						api.get("/products?limit=4&sort=sold_desc"), // Lấy 4 sản phẩm bán chạy nhất
					]);
				setFeaturedProducts(productRes.data.products);
				setCategories(categoryRes.data);
				setBrands(brandRes.data); // 🟢 NÂNG CẤP 1: Lưu brands
				setBestSellers(bestSellerRes.data.products);
			} catch (err) {
				console.error("Failed to fetch home page data", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* 1. HERO BANNER (Giữ nguyên) */}
			<div className="max-w-7xl mx-auto px-4 pt-10">
				<div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg h-80">
					<img
						src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
						alt="Shop Banner"
						className="w-full h-full object-cover opacity-50"
					/>
					<div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4 shadow-md">
							Chào mừng tới PKA<span className="text-secondary">Shop</span> 🛒
						</h1>
						<p className="text-lg md:text-xl text-gray-200 mb-8 shadow-sm">
							Khám phá các sản phẩm mới nhất và danh mục nổi bật.
						</p>
						<Link
							to="/products"
							className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-secondary transition-all duration-300 shadow-lg transform hover:scale-105">
							Xem tất cả sản phẩm
						</Link>
					</div>
				</div>
			</div>

			{/* 2. Phần Sản phẩm Nổi bật */}
			<div className="max-w-7xl mx-auto px-4 mt-16">
				<h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
					Sản phẩm Mới nhất
				</h2>
				{/* 🟢 NÂNG CẤP 2: Sử dụng Skeleton Loading */}
				{loading ? (
					// 1. Nếu đang tải -> Hiển thị Skeleton
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
							<SkeletonCard key={n} />
						))}
					</div>
				) : featuredProducts.length === 0 ? (
					// 2. Nếu không tải VÀ không có sản phẩm -> Hiển thị "Không tìm thấy"
					<p className="text-center text-gray-500 text-lg mt-10">
						Không tìm thấy sản phẩm nào.
					</p>
				) : (
					// 3. Nếu không tải VÀ có sản phẩm -> Hiển thị sản phẩm
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{featuredProducts.map((p) => (
							<ProductCard key={p._id} product={p} />
						))}
					</div>
				)}
			</div>

			{/* 🟢 THÊM: Phần Sản phẩm Bán chạy */}
			<div className="max-w-7xl mx-auto px-4 mt-16">
				<h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
					🔥 Sản phẩm Bán chạy
				</h2>
				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						{[1, 2, 3, 4].map((n) => (
							<SkeletonCard key={n} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						{bestSellers.map((p) => (
							<ProductCard key={p._id} product={p} />
						))}
					</div>
				)}
			</div>

			{/* 3. Phần Khám phá Danh mục */}
			<div className="max-w-7xl mx-auto mt-16 px-4">
				<h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
					Khám phá Danh mục
				</h2>
				{loading ? (
					<p className="text-center text-gray-500">Đang tải danh mục...</p>
				) : (
					<div className="flex flex-wrap justify-center gap-4">
						{categories.map((cat) => (
							<Link
								key={cat._id}
								to={`/products?category=${cat._id}`}
								className="bg-white shadow-md rounded-lg px-6 py-4 font-semibold text-gray-700 hover:bg-primary hover:text-white transition-all duration-200">
								{cat.name}
							</Link>
						))}
					</div>
				)}
			</div>

			{/* 4. 🟢 NÂNG CẤP 1: Phần Khám phá Thương hiệu */}
			<div className="max-w-7xl mx-auto mt-16 px-4">
				<h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
					Khám phá Thương hiệu
				</h2>
				{loading ? (
					<p className="text-center text-gray-500">Đang tải thương hiệu...</p>
				) : (
					<div className="flex flex-wrap justify-center gap-4">
						{brands.map((brand) => (
							<Link
								key={brand._id}
								to={`/products?brand=${brand._id}`} // Link đến trang lọc
								className="bg-white shadow-md rounded-lg px-6 py-4 font-semibold text-gray-700 hover:bg-primary hover:text-white transition-all duration-200">
								{brand.name}
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
