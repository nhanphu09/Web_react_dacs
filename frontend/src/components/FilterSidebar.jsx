import { X } from "lucide-react";

export default function FilterSidebar({
	// Props (State)
	categories,
	brands,
	q,
	category,
	brand,
	minPrice,
	maxPrice,
	// Props (Setters)
	setQ,
	setCategory,
	setBrand,
	setMinPrice,
	setMaxPrice,
	handleReset,
	handleSearch,
}) {
	return (
		<aside className="bg-white p-6 rounded-2xl shadow-lg h-fit sticky top-24">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-xl font-bold text-gray-800">Bộ lọc</h3>
				<button
					onClick={handleReset}
					className="text-sm font-medium text-primary hover:text-secondary flex items-center gap-1">
					<X size={16} /> Xóa tất cả
				</button>
			</div>

			<form onSubmit={handleSearch} className="space-y-6">
				{/* 1. Tìm kiếm */}
				<div>
					<label className="text-sm font-semibold text-gray-700 block mb-2">
						Tìm kiếm
					</label>
					<input
						type="text"
						placeholder="Tìm tên sản phẩm..."
						value={q}
						onChange={(e) => setQ(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				{/* 3. Khoảng giá */}
				<div>
					<label className="text-sm font-semibold text-gray-700 block mb-2">
						Khoảng giá
					</label>
					<div className="flex gap-2">
						<input
							type="number"
							placeholder="Từ"
							value={minPrice}
							onChange={(e) => setMinPrice(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						<input
							type="number"
							placeholder="Đến"
							value={maxPrice}
							onChange={(e) => setMaxPrice(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>

				{/* 4. Danh mục */}
				<div>
					<label className="text-sm font-semibold text-gray-700 block mb-2">
						Danh mục
					</label>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
						<option value="">Tất cả Danh mục</option>
						{categories.map((c) => (
							<option key={c._id} value={c._id}>
								{c.name}
							</option>
						))}
					</select>
				</div>

				{/* 5. Thương hiệu */}
				<div>
					<label className="text-sm font-semibold text-gray-700 block mb-2">
						Thương hiệu
					</label>
					<select
						value={brand}
						onChange={(e) => setBrand(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
						<option value="">Tất cả Thương hiệu</option>
						{brands.map((b) => (
							<option key={b._id} value={b._id}>
								{b.name}
							</option>
						))}
					</select>
				</div>

				{/* 6. Nút Lọc */}
				<button
					type="submit"
					className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-all">
					Áp dụng
				</button>
			</form>
		</aside>
	);
}
