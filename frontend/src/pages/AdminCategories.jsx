import { Edit, Tag, Trash2 } from "lucide-react"; // 🟢 THÊM ICONS
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

// Component Form chung
const CrudForm = ({ model, setModel, handleSubmit, resetForm }) => {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			className="space-y-3">
			<input
				className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
				placeholder={model._id ? "Đang sửa..." : "Tên mới..."}
				value={model.name}
				onChange={(e) => setModel({ ...model, name: e.target.value })}
			/>
			<div className="flex gap-2">
				<button
					type="submit"
					className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary transition">
					{model._id ? "Lưu thay đổi" : "Thêm mới"}
				</button>
				{model._id && (
					<button
						type="button"
						onClick={resetForm}
						className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
						Hủy
					</button>
				)}
			</div>
		</form>
	);
};

// Component Bảng chung
const CrudTable = ({ items, onEdit, onDelete }) => {
	return (
		<table className="w-full">
			<thead className="bg-gray-100 text-left text-gray-700">
				<tr>
					<th className="py-3 px-4">Tên</th>
					<th className="py-3 px-4 text-center">Hành động</th>
				</tr>
			</thead>
			<tbody>
				{items.map((item) => (
					<tr key={item._id} className="border-b hover:bg-gray-50 transition">
						<td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
						<td className="py-3 px-4">
							<div className="flex justify-center gap-2">
								<button
									onClick={() => onEdit(item)}
									className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200 transition">
									<Edit size={18} />
								</button>
								<button
									onClick={() => onDelete(item._id)}
									className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200 transition">
									<Trash2 size={18} />
								</button>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default function AdminCategories() {
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	// State cho form
	const [catModel, setCatModel] = useState({ _id: null, name: "" });
	const [brandModel, setBrandModel] = useState({ _id: null, name: "" });

	// Tải dữ liệu ban đầu
	const fetchData = async () => {
		try {
			const [catRes, brandRes] = await Promise.all([
				api.get("/categories"),
				api.get("/brands"),
			]);
			setCategories(catRes.data);
			setBrands(brandRes.data);
		} catch (err) {
			console.error("Failed to fetch data", err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	// --- Logic cho DANH MỤC ---
	const handleCatSubmit = async () => {
		if (!catModel.name) return toast.warn("Vui lòng nhập tên danh mục");
		try {
			if (catModel._id) {
				// Sửa
				await api.put(`/categories/${catModel._id}`, catModel);
				toast.success("Cập nhật thành công");
			} else {
				// Thêm
				await api.post("/categories", catModel);
				toast.success("Thêm thành công");
			}
			fetchData();
			setCatModel({ _id: null, name: "" });
		} catch (err) {
			toast.error("Thao tác thất bại");
		}
	};

	const deleteCategory = async (id) => {
		if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
		try {
			await api.delete(`/categories/${id}`);
			toast.success("Xóa thành công");
			fetchData();
		} catch (err) {
			toast.error("Xóa thất bại");
		}
	};

	// --- Logic cho THƯƠNG HIỆU ---
	const handleBrandSubmit = async () => {
		if (!brandModel.name) return toast.warn("Vui lòng nhập tên thương hiệu");
		try {
			if (brandModel._id) {
				// Sửa
				await api.put(`/brands/${brandModel._id}`, brandModel);
				toast.success("Cập nhật thành công");
			} else {
				// Thêm
				await api.post("/brands", brandModel);
				toast.success("Thêm thành công");
			}
			fetchData();
			setBrandModel({ _id: null, name: "" });
		} catch (err) {
			toast.error("Thao tác thất bại");
		}
	};

	const deleteBrand = async (id) => {
		if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
		try {
			await api.delete(`/brands/${id}`);
			toast.success("Xóa thành công");
			fetchData();
		} catch (err) {
			toast.error("Xóa thất bại");
		}
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
				<Tag className="text-primary" /> Quản lý Danh mục & Thương hiệu
			</h2>

			<div className="grid md:grid-cols-2 gap-8">
				{/* CỘT 1: DANH MỤC */}
				<div className="bg-white rounded-xl shadow p-6 space-y-4">
					<h3 className="text-xl font-semibold">Danh mục</h3>
					<CrudForm
						model={catModel}
						setModel={setCatModel}
						handleSubmit={handleCatSubmit}
						resetForm={() => setCatModel({ _id: null, name: "" })}
					/>
					<div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
						<CrudTable
							items={categories}
							onEdit={(item) => setCatModel(item)}
							onDelete={deleteCategory}
						/>
					</div>
				</div>

				{/* CỘT 2: THƯƠNG HIỆU */}
				<div className="bg-white rounded-xl shadow p-6 space-y-4">
					<h3 className="text-xl font-semibold">Thương hiệu</h3>
					<CrudForm
						model={brandModel}
						setModel={setBrandModel}
						handleSubmit={handleBrandSubmit}
						resetForm={() => setBrandModel({ _id: null, name: "" })}
					/>
					<div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
						<CrudTable
							items={brands}
							onEdit={(item) => setBrandModel(item)}
							onDelete={deleteBrand}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
