import React, { useEffect, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Products() {
	const [products, setProducts] = useState([]);
	const [q, setQ] = useState("");
	const [category, setCategory] = useState("");
	const [brand, setBrand] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");

	const fetch = async () => {
		try {
			const params = {};
			if (q) params.keyword = q;
			if (category) params.category = category;
			if (brand) params.brand = brand;
			if (minPrice) params.minPrice = minPrice;
			if (maxPrice) params.maxPrice = maxPrice;
			const res = await api.get("/products", { params });
			setProducts(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetch();
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		fetch();
	};

	const handleReset = () => {
		setQ("");
		setCategory("");
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		fetch();
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
				<input
					type="text"
					placeholder="Tìm kiếm..."
					value={q}
					onChange={(e) => setQ(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="text"
					placeholder="Danh mục"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="text"
					placeholder="Thương hiệu"
					value={brand}
					onChange={(e) => setBrand(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
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

			{/* Danh sách sản phẩm */}
			{products.length === 0 ? (
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
		</div>
	);
}
