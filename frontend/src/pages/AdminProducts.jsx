import { Package, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

export default function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [model, setModel] = useState({
		title: "",
		price: 0,
		description: "",
		category: "",
		brand: "",
		image: "",
	});
	const [categories, setCategories] = useState([]); // 🟢 THÊM
	const [brands, setBrands] = useState([]); // 🟢 THÊM

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [prodRes, catRes, brandRes] = await Promise.all([
					api.get("/products"),
					api.get("/categories"), // Đã có từ Giai đoạn 3
					api.get("/brands"), // Đã có từ Giai đoạn 3
				]);
				setProducts(prodRes.data.products);
				setCategories(catRes.data);
				setBrands(brandRes.data);
			} catch (err) {
				console.error("Failed to fetch initial data", err);
			}
		};
		fetchData();
	}, []);

	const create = async () => {
		if (!model.title || model.price <= 0) {
			toast.warn("Vui lòng nhập đầy đủ thông tin sản phẩm!");
			return;
		}
		const r = await api.post("/products", model);
		setProducts([r.data, ...products]);
		setModel({
			title: "",
			price: 0,
			description: "",
			category: "",
			brand: "",
			image: "",
		}); // 🟢 SỬA
	};

	const remove = async (id) => {
		if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
		await api.delete(`/products/${id}`);
		setProducts(products.filter((p) => p._id !== id));
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			{/* Tiêu đề */}
			<div className="flex items-center gap-2 mb-6">
				<Package className="text-primary" size={28} />
				<h2 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h2>
			</div>

			{/* Form thêm sản phẩm */}
			<div className="bg-white rounded-xl shadow p-6 mb-8">
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<Plus className="text-green-600" /> Thêm sản phẩm mới
				</h3>

				<div className="grid sm:grid-cols-6 gap-4">
					<input
						type="text"
						placeholder="Tên sản phẩm"
						value={model.title}
						onChange={(e) => setModel({ ...model, title: e.target.value })}
						className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
					/>
					<input
						type="number"
						placeholder="Giá"
						value={model.price}
						onChange={(e) =>
							setModel({ ...model, price: Number(e.target.value) })
						}
						className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
					/>
					<input
						type="text"
						placeholder="Mô tả"
						value={model.description}
						onChange={(e) =>
							setModel({ ...model, description: e.target.value })
						}
						className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
					/>
					<input
						type="text"
						placeholder="Image URL"
						value={model.image}
						onChange={(e) => setModel({ ...model, image: e.target.value })}
						className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
					/>
					<select
						value={model.category}
						onChange={(e) => setModel({ ...model, category: e.target.value })}
						className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-white">
						<option value="">-- Chọn Danh mục --</option>
						{categories.map((c) => (
							<option key={c._id} value={c._id}>
								{c.name}
							</option>
						))}
					</select>
					<select
						value={model.brand}
						onChange={(e) => setModel({ ...model, brand: e.target.value })}
						className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-white">
						<option value="">-- Chọn Thương Hiệu --</option>
						{brands.map((b) => (
							<option key={b._id} value={b._id}>
								{b.name}
							</option>
						))}
					</select>
				</div>

				<div className="mt-4 flex justify-end">
					<button
						onClick={create}
						className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition">
						Thêm sản phẩm
					</button>
				</div>
			</div>

			{/* Danh sách sản phẩm */}
			<div className="bg-white rounded-xl shadow p-6">
				<h3 className="text-xl font-semibold mb-4 text-gray-800">
					📦 Danh sách sản phẩm ({products.length})
				</h3>

				{products.length === 0 ? (
					<p className="text-gray-500 italic">Chưa có sản phẩm nào.</p>
				) : (
					<div className="space-y-3">
						{products.map((p) => (
							<div
								key={p._id}
								className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50 transition">
								<div>
									<p className="font-semibold text-lg text-gray-800">
										{p.title}
									</p>
									<p className="text-gray-600 text-sm">
										Giá:{" "}
										<span className="font-medium text-primary">
											{p.price.toLocaleString()} đ
										</span>
									</p>
									<p className="text-gray-500 text-sm mt-1">
										{p.description || "Không có mô tả"}
									</p>
								</div>
								<button
									onClick={() => remove(p._id)}
									className="bg-red-500 text-white px-4 py-2 rounded-md font-medium flex items-center gap-1 hover:bg-red-600 transition">
									<Trash2 size={18} /> Xóa
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
