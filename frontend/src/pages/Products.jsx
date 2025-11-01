import { useEffect, useState } from "react";
import api from "../api/client";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";

// Skeleton Card
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
	// State
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalProducts, setTotalProducts] = useState(0);
	const [q, setQ] = useState("");
	const [category, setCategory] = useState("");
	const [brand, setBrand] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [sort, setSort] = useState("createdAt_desc");
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const params = { page, limit: 9, sort };
			if (q) params.keyword = q;
			if (category) params.category = category;
			if (brand) params.brand = brand;
			if (minPrice) params.minPrice = minPrice;
			if (maxPrice) params.maxPrice = maxPrice;

			const res = await api.get("/products", { params });
			setProducts(res.data.products);
			setTotalPages(res.data.totalPages);
			setTotalProducts(res.data.count);
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

	useEffect(() => {
		fetchProducts();
	}, [page, sort, category, brand, minPrice, maxPrice, q]);

	useEffect(() => {
		fetchFilters();
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		if (page !== 1) {
			setPage(1);
		} else {
			fetchProducts();
		}
	};

	const handleReset = () => {
		setQ("");
		setCategory("");
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		setSort("createdAt_desc");
		if (page !== 1) {
			setPage(1);
		} else {
			setTimeout(fetchProducts, 0);
		}
	};

	const isFiltering =
		q || category || brand || minPrice || maxPrice || sort !== "createdAt_desc";

	return (
		<div className="max-w-7xl mx-auto px-4 py-10">
			<h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
				Tất cả sản phẩm
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* CỘT 1: SIDEBAR LỌC */}
				<div className="md:col-span-1">
					<FilterSidebar
						categories={categories}
						brands={brands}
						q={q}
						setQ={setQ}
						category={category}
						setCategory={setCategory}
						brand={brand}
						setBrand={setBrand}
						minPrice={minPrice}
						setMinPrice={setMinPrice}
						maxPrice={maxPrice}
						setMaxPrice={setMaxPrice}
						handleReset={handleReset}
						handleSearch={handleSearch}
					/>
				</div>

				{/* CỘT 2: LƯỚI SẢN PHẨM */}
				<div className="md:col-span-3">
					{/* HEADER CHO CỘT SẢN PHẨM (ĐẾM + SẮP XẾP) */}
					<div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
						<p className="text-gray-700 font-medium text-sm mb-2 md:mb-0">
							{!loading && (
								<>
									Tìm thấy{" "}
									<span className="font-bold text-primary">
										{totalProducts}
									</span>{" "}
									sản phẩm
								</>
							)}
						</p>
						<div className="flex items-center gap-2">
							<label className="text-sm font-medium text-gray-700">
								Sắp xếp theo:
							</label>
							<select
								value={sort}
								onChange={(e) => setSort(e.target.value)}
								className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white">
								<option value="createdAt_desc">Mới nhất</option>
								<option value="price_asc">Giá: Tăng dần</option>
								<option value="price_desc">Giá: Giảm dần</option>
								<option value="sort_dects">Bán chạy nhất</option>
							</select>
						</div>
					</div>
					{/* (Kết thúc header) */}

					{/* Khu vực hiển thị bộ lọc (Giữ nguyên) */}
					{isFiltering && (
						<div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-700">
							<span className="font-semibold">Đang lọc theo:</span>
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
							{category && categories.find((c) => c._id === category) && (
								<span className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
									DM: {categories.find((c) => c._id === category)?.name}
									<button
										onClick={() => setCategory("")}
										className="text-red-500 font-bold">
										✕
									</button>
								</span>
							)}
							{brand && brands.find((b) => b._id === brand) && (
								<span className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
									TH: {brands.find((b) => b._id === brand)?.name}
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
							<button
								onClick={handleReset}
								className="text-primary hover:underline ml-auto font-medium">
								Xóa tất cả
							</button>
						</div>
					)}

					{/* Lưới sản phẩm (Giữ nguyên) */}
					{loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(9)].map((_, i) => (
								<SkeletonCard key={i} />
							))}
						</div>
					) : products.length === 0 ? (
						<div className="text-center text-gray-500 text-lg py-20 bg-white rounded-2xl shadow-lg">
							<p>🤷‍♀️ Không tìm thấy sản phẩm nào.</p>
							<button
								onClick={handleReset}
								className="mt-2 text-primary hover:underline">
								Thử xóa bộ lọc xem sao?
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{products.map((p) => (
								<ProductCard key={p._id} product={p} />
							))}
						</div>
					)}

					{/* Phân trang (Giữ nguyên) */}
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
			</div>
		</div>
	);
}
