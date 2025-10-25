import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminCategories() {
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [newCat, setNewCat] = useState("");
	const [newBrand, setNewBrand] = useState("");

	useEffect(() => {
		api.get("/categories").then((res) => setCategories(res.data));
		api.get("/brands").then((res) => setBrands(res.data));
	}, []);

	const addCategory = async () => {
		const res = await api.post("/categories", { name: newCat });
		setCategories([...categories, res.data]);
		setNewCat("");
	};

	const addBrand = async () => {
		const res = await api.post("/brands", { name: newBrand });
		setBrands([...brands, res.data]);
		setNewBrand("");
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">
				🗂 Quản lý Danh mục & Thương hiệu
			</h2>

			<div className="grid md:grid-cols-2 gap-6">
				{/* Danh mục */}
				<div>
					<h3 className="text-lg font-semibold mb-3">Danh mục</h3>
					<ul className="border rounded p-3 space-y-2 mb-3">
						{categories.map((c) => (
							<li key={c._id}>{c.name}</li>
						))}
					</ul>
					<div className="flex gap-2">
						<input
							className="border px-3 py-2 rounded w-full"
							placeholder="Tên danh mục mới..."
							value={newCat}
							onChange={(e) => setNewCat(e.target.value)}
						/>
						<button
							onClick={addCategory}
							className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700">
							Thêm
						</button>
					</div>
				</div>

				{/* Thương hiệu */}
				<div>
					<h3 className="text-lg font-semibold mb-3">Thương hiệu</h3>
					<ul className="border rounded p-3 space-y-2 mb-3">
						{brands.map((b) => (
							<li key={b._id}>{b.name}</li>
						))}
					</ul>
					<div className="flex gap-2">
						<input
							className="border px-3 py-2 rounded w-full"
							placeholder="Tên thương hiệu mới..."
							value={newBrand}
							onChange={(e) => setNewBrand(e.target.value)}
						/>
						<button
							onClick={addBrand}
							className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700">
							Thêm
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
