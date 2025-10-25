import React, { useEffect, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Products() {
	// State cho danh sách sản phẩm
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // 🟢 THÊM: State cho trang hiện tại
	const [totalPages, setTotalPages] = useState(1); // 🟢 THÊM: State cho tổng số trang

	// State cho các bộ lọc
	const [q, setQ] = useState("");
	const [category, setCategory] = useState("");
	const [brand, setBrand] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [sort, setSort] = useState("createdAt_desc");

	// 🟢 NÂNG CẤP: State cho dropdowns
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const params = {};
			if (q) params.keyword = q;
			if (category) params.category = category;
			if (brand) params.brand = brand;
			if (minPrice) params.minPrice = minPrice;
			if (maxPrice) params.maxPrice = maxPrice;
			params.page = page;
			params.sort = sort;
			params.limit = 8; // (Giữ cố định 8 SP mỗi trang)

			// Gọi API sản phẩm với các tham số lọc
			const res = await api.get("/products", { params });
			setProducts(res.data.products); // 🟢 SỬA
			setTotalPages(res.data.totalPages);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const fetchFilters = async () => {
		try {
			// 🟢 NÂNG CẤP: Tải danh mục và thương hiệu cho dropdowns
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
	}, [page]);

	// useEffect này CHỈ chạy khi BỘ LỌC thay đổi
	useEffect(() => {
		setPage(1); // 🟢 THÊM: Reset về trang 1
		fetchProducts();
	}, [sort, category, brand, minPrice, maxPrice, q]); // 🟢 TÁCH RA

	// useEffect này CHỈ chạy 1 LẦN
	useEffect(() => {
		fetchFilters();
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		setPage(1); // Reset về trang 1 khi tìm kiếm
		// useEffect sẽ tự động gọi fetchProducts khi page thay đổi
	};

	const handleReset = () => {
		// Reset tất cả state của bộ lọc
		setQ("");
		setPage(1);
		setCategory("");
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		// Tải lại sản phẩm (không có bộ lọc)
		// Chúng ta dùng một mẹo nhỏ là bọc trong hàm setTimeout
		// để đảm bảo state được reset trước khi gọi API
		setTimeout(() => fetchProducts(), 0);
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
				{/* Lọc Keyword */}
				<input
					type="text"
					placeholder="Tìm kiếm..."
					value={q}
					onChange={(e) => setQ(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>

				{/* 🟢 NÂNG CẤP: Lọc Danh mục (Dropdown) */}
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

				{/* 🟢 NÂNG CẤP: Lọc Thương hiệu (Dropdown) */}
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

				{/* Lọc Giá */}
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

				{/* Nút */}
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

			{/* Danh sách sản phẩm */}
			{loading ? (
				<p className="text-center text-gray-500 text-lg mt-10">
					Đang tải sản phẩm...
				</p>
			) : products.length === 0 ? (
				<p className="text-center text-gray-500 text-lg mt-10">
					Không tìm thấy sản phẩm nào.
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{products.map((p) => (
						<ProductCard key={p._id} product={p} />
					))}
				</div>
			)}
			{/* 🟢 THÊM: Khối Phân trang */}
			{!loading && products.length > 0 && (
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
