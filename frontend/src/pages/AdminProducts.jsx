import { Edit, Package, Plus, Trash2, X, UploadCloud } from "lucide-react"; // Thêm icon Upload
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

export default function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [uploading, setUploading] = useState(false); // State loading upload

	const initialModelState = {
		_id: null,
		title: "",
		price: 0,
		description: "",
		category: "",
		brand: "",
		image: "",
		stock: 0,
		specs: [],
		promotions: [],
	};
	const [model, setModel] = useState(initialModelState);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [prodRes, catRes, brandRes] = await Promise.all([
					api.get("/products"),
					api.get("/categories"),
					api.get("/brands"),
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

	const resetForm = () => {
		setModel(initialModelState);
	};

	// --- HÀM XỬ LÝ UPLOAD ẢNH ---
	const handleUploadFile = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("image", file);

		setUploading(true);
		try {
			// Gọi API upload (Backend sẽ xử lý đẩy lên Cloudinary)
			const res = await api.post("/upload", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			// Gán link ảnh trả về vào model
			setModel({ ...model, image: res.data.url });
			toast.success("Upload ảnh thành công!");
		} catch (err) {
			console.error(err);
			toast.error("Lỗi upload ảnh (Kiểm tra backend)");
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		if (!model.title || model.price <= 0 || !model.category || !model.brand) {
			toast.warn("Vui lòng nhập đầy đủ Tên, Giá, Danh mục và Thương hiệu!");
			return;
		}

		try {
			if (model._id) {
				const res = await api.put(`/products/${model._id}`, model);
				setProducts(products.map((p) => (p._id === model._id ? res.data : p)));
				toast.success("Cập nhật sản phẩm thành công!");
			} else {
				const res = await api.post("/products", model);
				setProducts([res.data, ...products]);
				toast.success("Thêm sản phẩm thành công!");
			}
			resetForm();
		} catch (err) {
			toast.error("Thao tác thất bại. Vui lòng thử lại.");
		}
	};

	const remove = async (id) => {
		if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
		await api.delete(`/products/${id}`);
		setProducts(products.filter((p) => p._id !== id));
		toast.success("Xóa sản phẩm thành công!");
	};

	const handleEdit = (product) => {
		setModel({
			...product,
			category: product.category?._id || product.category,
			brand: product.brand?._id || product.brand,
		});
		window.scrollTo(0, 0);
	};

	// --- Hàm xử lý Specs & Promo ---
	const handleSpecChange = (index, field, value) => {
		const newSpecs = [...model.specs];
		newSpecs[index][field] = value;
		setModel({ ...model, specs: newSpecs });
	};
	const addSpec = () => setModel({ ...model, specs: [...model.specs, { key: "", value: "" }] });
	const removeSpec = (index) => setModel({ ...model, specs: model.specs.filter((_, i) => i !== index) });

	const handlePromoChange = (index, value) => {
		const newPromos = [...model.promotions];
		newPromos[index] = value;
		setModel({ ...model, promotions: newPromos });
	};
	const addPromo = () => setModel({ ...model, promotions: [...model.promotions, ""] });
	const removePromo = (index) => setModel({ ...model, promotions: model.promotions.filter((_, i) => i !== index) });

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="flex items-center gap-2 mb-6">
				<Package className="text-primary" size={28} />
				<h2 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h2>
			</div>

			{/* Form thêm/sửa sản phẩm */}
			<div className="bg-white rounded-xl shadow p-6 mb-8">
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<Plus className="text-green-600" />
					{model._id ? "Đang sửa sản phẩm" : "Thêm sản phẩm mới"}
				</h3>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Cột 1: Thông tin cơ bản */}
					<div className="space-y-4">
						<input
							type="text"
							placeholder="Tên sản phẩm (*)"
							value={model.title}
							onChange={(e) => setModel({ ...model, title: e.target.value })}
							className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
						/>
						<div className="grid grid-cols-2 gap-4">
							<input
								type="number"
								placeholder="Giá (*)"
								value={model.price}
								onChange={(e) => setModel({ ...model, price: Number(e.target.value) })}
								className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
							/>
							<input
								type="number"
								placeholder="Tồn kho"
								value={model.stock}
								onChange={(e) => setModel({ ...model, stock: Number(e.target.value) })}
								className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
							/>
						</div>
						<select
							value={model.category}
							onChange={(e) => setModel({ ...model, category: e.target.value })}
							className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-white">
							<option value="">-- Chọn Danh mục (*) --</option>
							{categories.map((c) => (
								<option key={c._id} value={c._id}>{c.name}</option>
							))}
						</select>
						<select
							value={model.brand}
							onChange={(e) => setModel({ ...model, brand: e.target.value })}
							className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-white">
							<option value="">-- Chọn Thương Hiệu (*) --</option>
							{brands.map((b) => (
								<option key={b._id} value={b._id}>{b.name}</option>
							))}
						</select>

						{/* --- PHẦN UPLOAD ẢNH MỚI --- */}
						<div className="border rounded-lg p-3 bg-gray-50">
							<label className="block text-sm font-medium mb-2 text-gray-700">Hình ảnh sản phẩm</label>
							<div className="flex gap-2 items-center">
								<input
									type="text"
									className="flex-1 border rounded-lg px-3 py-2 text-sm text-gray-600 focus:ring-1 focus:ring-primary outline-none"
									placeholder="Link ảnh hoặc upload file..."
									value={model.image}
									onChange={(e) => setModel({ ...model, image: e.target.value })}
								/>
								<label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${uploading ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
									}`}>
									<UploadCloud size={18} />
									{uploading ? "Đang tải..." : "Chọn ảnh"}
									<input
										type="file"
										className="hidden"
										accept="image/*"
										onChange={handleUploadFile}
										disabled={uploading}
									/>
								</label>
							</div>
							{/* Preview ảnh */}
							{model.image && (
								<div className="mt-3 w-32 h-32 border rounded-lg overflow-hidden bg-white shadow-sm mx-auto">
									<img
										src={model.image}
										alt="Preview"
										className="w-full h-full object-contain"
									/>
								</div>
							)}
						</div>

						<textarea
							placeholder="Mô tả (Dùng Enter để xuống dòng)"
							value={model.description}
							onChange={(e) => setModel({ ...model, description: e.target.value })}
							className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
							rows={4}
						/>
					</div>

					{/* Cột 2 - Specs & Promotions (Giữ nguyên) */}
					<div className="space-y-6">
						<div className="space-y-4">
							<h4 className="font-semibold text-gray-700">Thông số kỹ thuật</h4>
							<div className="space-y-3 max-h-48 overflow-y-auto pr-2 border p-3 rounded-lg bg-white">
								{model.specs.map((spec, index) => (
									<div key={index} className="flex items-start gap-2">
										<input
											type="text"
											placeholder="Tên (VD: RAM)"
											value={spec.key}
											onChange={(e) => handleSpecChange(index, "key", e.target.value)}
											className="w-1/2 border rounded-lg px-3 py-2 text-sm"
										/>
										<textarea
											placeholder="Giá trị..."
											value={spec.value}
											onChange={(e) => handleSpecChange(index, "value", e.target.value)}
											className="w-1/2 border rounded-lg px-3 py-2 text-sm"
											rows={1}
										/>
										<button type="button" onClick={() => removeSpec(index)} className="text-red-500 p-2 hover:bg-red-50 rounded-full"><X size={16} /></button>
									</div>
								))}
							</div>
							<button type="button" onClick={addSpec} className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 text-sm border border-dashed border-gray-300">
								+ Thêm thông số
							</button>
						</div>

						<div className="space-y-4">
							<h4 className="font-semibold text-gray-700">Khuyến mãi</h4>
							<div className="space-y-3 max-h-48 overflow-y-auto pr-2 border p-3 rounded-lg bg-white">
								{model.promotions.map((promo, index) => (
									<div key={index} className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Nội dung khuyến mãi..."
											value={promo}
											onChange={(e) => handlePromoChange(index, e.target.value)}
											className="w-full border rounded-lg px-3 py-2 text-sm"
										/>
										<button type="button" onClick={() => removePromo(index)} className="text-red-500 p-2 hover:bg-red-50 rounded-full"><X size={16} /></button>
									</div>
								))}
							</div>
							<button type="button" onClick={addPromo} className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 text-sm border border-dashed border-gray-300">
								+ Thêm khuyến mãi
							</button>
						</div>
					</div>
				</div>

				{/* Nút bấm */}
				<div className="mt-6 flex justify-end gap-3 border-t pt-4">
					{model._id && (
						<button type="button" onClick={resetForm} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">Hủy</button>
					)}
					<button onClick={handleSubmit} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition shadow-lg">
						{model._id ? "Lưu thay đổi" : "Thêm sản phẩm"}
					</button>
				</div>
			</div>

			{/* DANH SÁCH SẢN PHẨM */}
			<div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
				<h3 className="text-xl font-semibold mb-4 text-gray-800">📦 Danh sách sản phẩm ({products.length})</h3>
				{products.length === 0 ? (
					<p className="text-gray-500 italic">Chưa có sản phẩm nào.</p>
				) : (
					<table className="w-full min-w-[600px]">
						<thead className="bg-gray-100 text-left text-gray-700">
							<tr>
								<th className="py-3 px-4">Ảnh</th>
								<th className="py-3 px-4">Tên sản phẩm</th>
								<th className="py-3 px-4">Giá</th>
								<th className="py-3 px-4">Tồn kho</th>
								<th className="py-3 px-4 text-center">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{products.map((p) => (
								<tr key={p._id} className="border-b hover:bg-gray-50 transition">
									<td className="py-3 px-4">
										<div className="w-12 h-12 bg-white border rounded-md overflow-hidden p-1">
											<img src={p.image} alt={p.title} className="w-full h-full object-contain" />
										</div>
									</td>
									<td className="py-3 px-4 font-medium text-gray-800">{p.title}</td>
									<td className="py-3 px-4 text-primary font-semibold">{p.price.toLocaleString("vi-VN")} đ</td>
									<td className="py-3 px-4 text-gray-700">{p.stock}</td>
									<td className="py-3 px-4 text-center">
										<div className="flex justify-center gap-2">
											<button onClick={() => handleEdit(p)} className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200 transition"><Edit size={18} /></button>
											<button onClick={() => remove(p._id)} className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200 transition"><Trash2 size={18} /></button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}