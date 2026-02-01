import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";

// Skeleton Loading
const SkeletonCard = () => (
	<div className="bg-white border rounded-xl p-4 shadow-sm animate-pulse">
		<div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
		<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
		<div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
		<div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
	</div>
);

export default function Products() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	// State dữ liệu
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);

	// State bộ lọc
	const [q, setQ] = useState(queryParams.get("keyword") || "");
	const [category, setCategory] = useState(queryParams.get("category") || "");
	const [brand, setBrand] = useState(queryParams.get("brand") || "");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [sort, setSort] = useState("createdAt_desc");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// Cập nhật state khi URL thay đổi (VD: click từ Menu)
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setCategory(params.get("category") || "");
		setBrand(params.get("brand") || "");
		setQ(params.get("keyword") || "");
		setPage(1);
	}, [location.search]);

	// Tải danh mục & thương hiệu (1 lần)
	useEffect(() => {
		const fetchFilters = async () => {
			try {
				const [catRes, brandRes] = await Promise.all([
					api.get("/categories"),
					api.get("/brands"),
				]);
				setCategories(catRes.data);
				setBrands(brandRes.data);
			} catch (err) {
				console.error("Lỗi tải bộ lọc", err);
			}
		};
		fetchFilters();
	}, []);

	// Gọi API lấy sản phẩm
	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const params = {
					page,
					limit: 12,
					sort,
					keyword: q,
					category,
					brand,
					minPrice,
					maxPrice,
				};
				// Loại bỏ các key rỗng để URL sạch hơn
				Object.keys(params).forEach(key => !params[key] && delete params[key]);

				const res = await api.get("/products", { params });
				setProducts(res.data.products);
				setTotalPages(res.data.totalPages);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [page, sort, category, brand, minPrice, maxPrice, q]);

	const handleReset = () => {
		setQ("");
		setCategory("");
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		setSort("createdAt_desc");
		setPage(1);
	};

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar Lọc */}
				<div className="w-full md:w-1/4 hidden md:block">
					<FilterSidebar
						categories={categories}
						brands={brands}
						q={q} setQ={setQ}
						category={category} setCategory={setCategory}
						brand={brand} setBrand={setBrand}
						minPrice={minPrice} setMinPrice={setMinPrice}
						maxPrice={maxPrice} setMaxPrice={setMaxPrice}
						handleReset={handleReset}
						handleSearch={(e) => e.preventDefault()}
					/>
				</div>

				{/* Danh sách sản phẩm */}
				<div className="flex-1">
					<div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
						<h2 className="text-xl font-bold text-gray-800">
							Danh sách sản phẩm ({products.length})
						</h2>
						<select
							value={sort}
							onChange={(e) => setSort(e.target.value)}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white">
							<option value="createdAt_desc">Mới nhất</option>
							<option value="price_asc">Giá tăng dần</option>
							<option value="price_desc">Giá giảm dần</option>
							<option value="sort_dects">Bán chạy nhất</option>
						</select>
					</div>

					{loading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
							{Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
						</div>
					) : products.length === 0 ? (
						<div className="text-center py-20 bg-white rounded-xl shadow-sm">
							<p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
							<button onClick={handleReset} className="mt-2 text-primary font-medium hover:underline">
								Xóa bộ lọc
							</button>
						</div>
					) : (
						<>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
								{products.map((p) => (
									<ProductCard key={p._id} product={p} />
								))}
							</div>

							{totalPages > 1 && (
								<div className="flex justify-center mt-10 gap-2">
									<button
										disabled={page === 1}
										onClick={() => setPage(page - 1)}
										className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50">
										Trước
									</button>
									<span className="px-4 py-2 font-bold text-primary">
										{page} / {totalPages}
									</span>
									<button
										disabled={page === totalPages}
										onClick={() => setPage(page + 1)}
										className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50">
										Sau
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}