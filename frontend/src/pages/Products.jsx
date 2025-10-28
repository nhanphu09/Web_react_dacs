import React, { useEffect, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

// 🟢 Skeleton Card component for loading state
const SkeletonCard = () => (
	<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 animate-pulse">
		<div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
		<div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
		<div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
		<div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
		<div className="h-10 bg-gray-200 rounded-md mt-3"></div>
	</div>
);

export default function Products() {
	// State cho danh sách sản phẩm
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// State cho các bộ lọc
	const [q, setQ] = useState("");
	const [category, setCategory] = useState("");
	const [brand, setBrand] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [sort, setSort] = useState("createdAt_desc");

	// State cho dropdowns
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const params = { page, limit: 8, sort };
			if (q) params.keyword = q;
			if (category) params.category = category;
			if (brand) params.brand = brand;
			if (minPrice) params.minPrice = minPrice;
			if (maxPrice) params.maxPrice = maxPrice;

			const res = await api.get("/products", { params });
			setProducts(res.data.products);
			setTotalPages(res.data.totalPages);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const fetchFilters = async () => {
		try {
			const [catRes, brandRes] = await Promise.all([
				api.get("/categories"),
				api.get("/brands"),
			]);
			setCategories(catRes.data);
			setBrands(brandRes.data);
		} catch (err) {
			console.error("Failed to fetch filters", err);
		}
	};

	// useEffect này chạy khi trang hoặc bộ lọc thay đổi
	useEffect(() => {
		fetchProducts();
	}, [page, sort, category, brand, minPrice, maxPrice, q]);

	// useEffect này CHỈ chạy 1 LẦN để tải dữ liệu cho dropdowns
	useEffect(() => {
		fetchFilters();
	}, []);

	// Reset về trang 1 khi tìm kiếm
	const handleSearch = (e) => {
		e.preventDefault();
		if (page !== 1) {
			setPage(1); // Changing page triggers useEffect above
		} else {
			fetchProducts(); // Manually trigger if already on page 1
		}
	};

	// Reset tất cả bộ lọc và về trang 1
	const handleReset = () => {
		setQ("");
		setCategory("");
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		setSort("createdAt_desc");
		if (page !== 1) {
			setPage(1); // Changing page triggers useEffect above
		} else {
			// Need a slight delay if already on page 1 to allow state reset
			setTimeout(fetchProducts, 0);
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-10">
			<h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
				Tất cả sản phẩm
			</h2>

			{/* Bộ lọc */}
			<form
				onSubmit={handleSearch}
				className="flex flex-wrap gap-4 items-center justify-center bg-white p-5 rounded-2xl shadow-md mb-10">
				{/* Filters Inputs/Selects (Keep as is) */}
				<input
					type="text"
					placeholder="Tìm kiếm..."
					value={q}
					onChange={(e) => setQ(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
					<option value="">Tất cả Danh mục</option>
					{categories.map((c) => (
						<option key={c._id} value={c._id}>
							{c.name}
						</option>
					))}
				</select>
				<select
					value={brand}
					onChange={(e) => setBrand(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
					<option value="">Tất cả Thương hiệu</option>
					{brands.map((b) => (
						<option key={b._id} value={b._id}>
							{b.name}
						</option>
					))}
				</select>
				<select
					value={sort}
					onChange={(e) => setSort(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
					<option value="createdAt_desc">Mới nhất</option>
					<option value="price_asc">Giá: Tăng dần</option>
					<option value="price_desc">Giá: Giảm dần</option>
				</select>
				<input
					type="number"
					placeholder="Giá từ"
					value={minPrice}
					onChange={(e) => setMinPrice(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="number"
					placeholder="Đến"
					value={maxPrice}
					onChange={(e) => setMaxPrice(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all">
					Tìm kiếm
				</button>
				<button
					type="button"
					onClick={handleReset}
					className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all">
					Đặt lại
				</button>
			</form>

			{/* Hiển thị bộ lọc đang áp dụng */}
			<div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-600">
				{(q ||
					category ||
					brand ||
					minPrice ||
					maxPrice ||
					sort !== "createdAt_desc") && (
					<>
						<span>Đang lọc theo:</span>
						{/* Individual filter tags (Keep as is) */}
						{category && categories.find((c) => c._id === category) && (
							<span className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
								Danh mục: {categories.find((c) => c._id === category)?.name}
								<button
									onClick={() => setCategory("")}
									className="text-red-500 font-bold">
									✕
								</button>
							</span>
						)}
						{brand && brands.find((b) => b._id === brand) && (
							<span className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
								Thương hiệu: {brands.find((b) => b._id === brand)?.name}
								<button
									onClick={() => setBrand("")}
									className="text-red-500 font-bold">
									✕
								</button>
							</span>
						)}
						{(minPrice || maxPrice) && (
							<span className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
								Giá: {minPrice || "Từ"} - {maxPrice || "Đến"}
								<button
									onClick={() => {
										setMinPrice("");
										setMaxPrice("");
									}}
									className="text-red-500 font-bold">
									✕
								</button>
							</span>
						)}
						{q && (
							<span className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
								Từ khóa: "{q}"
								<button
									onClick={() => setQ("")}
									className="text-red-500 font-bold">
									✕
								</button>
							</span>
						)}
						{sort !== "createdAt_desc" && (
							<span className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
								Sắp xếp:{" "}
								{sort === "price_asc" ? "Giá tăng dần" : "Giá giảm dần"}
								<button
									onClick={() => setSort("createdAt_desc")}
									className="text-red-500 font-bold">
									✕
								</button>
							</span>
						)}
						{/* Nút Xóa tất cả */}
						<button
							onClick={handleReset}
							className="text-blue-600 hover:underline ml-2">
							Xóa tất cả bộ lọc
						</button>
					</>
				)}
			</div>

			{/* Danh sách sản phẩm */}
			{loading ? (
				// 🟢 SỬA: Hiển thị Skeleton Loading
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
						<SkeletonCard key={n} />
					))}
				</div>
			) : products.length === 0 ? (
				// 🟢 SỬA: Thông báo "Not Found" tốt hơn
				<div className="text-center text-gray-500 text-lg mt-10">
					<p>🤷‍♀️ Không tìm thấy sản phẩm nào khớp với bộ lọc của bạn.</p>
					<button
						onClick={handleReset}
						className="mt-2 text-blue-600 hover:underline">
						Thử xóa bộ lọc xem sao?
					</button>
				</div>
			) : (
				// Hiển thị sản phẩm thật
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{products.map((p) => (
						<ProductCard key={p._id} product={p} />
					))}
				</div>
			)}

			{/* Phân trang (Chỉ hiển thị nếu có nhiều hơn 1 trang) */}
			{!loading && products.length > 0 && totalPages > 1 && (
				<div className="flex justify-center items-center gap-4 mt-10">
					<button
						onClick={() => setPage((p) => Math.max(p - 1, 1))}
						disabled={page === 1}
						className="bg-white px-4 py-2 rounded-md shadow border disabled:opacity-50">
						Trước
					</button>
					<span className="font-medium">
						Trang {page} / {totalPages}
					</span>
					<button
						onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
						disabled={page === totalPages}
						className="bg-white px-4 py-2 rounded-md shadow border disabled:opacity-50">
						Sau
					</button>
				</div>
			)}
		</div>
	);
}
