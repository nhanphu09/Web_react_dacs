import { Lock, Search, Unlock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

export default function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	// State cho Tìm kiếm & Phân trang
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// useEffect để xử lý Phân trang/Tìm kiếm
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const params = { page };
				if (keyword) {
					params.keyword = keyword;
				}

				const res = await api.get("/users", { params });
				setUsers(res.data.users);
				setTotalPages(res.data.totalPages);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, [page, keyword]);

	const lock = async (id) => {
		await api.put(`/users/${id}/lock`);
		setUsers(users.map((u) => (u._id === id ? { ...u, locked: true } : u)));
		toast.success("Đã khóa tài khoản.");
	};

	const unlock = async (id) => {
		await api.put(`/users/${id}/unlock`);
		setUsers(users.map((u) => (u._id === id ? { ...u, locked: false } : u)));
		toast.success("Đã mở khóa tài khoản.");
	};

	// Hàm xử lý tìm kiếm
	const handleSearch = (e) => {
		e.preventDefault();
		setPage(1); // Reset về trang 1 khi tìm kiếm
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
				<Users className="text-primary" /> Quản lý người dùng
			</h2>

			{/* THANH TÌM KIẾM */}
			<div className="bg-white rounded-xl shadow p-4 mb-6">
				<form
					onSubmit={handleSearch}
					className="flex items-center w-full md:w-1/3">
					<input
						type="text"
						placeholder="Tìm theo Tên hoặc Email..."
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						className="border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
					/>
					<button
						type="submit"
						className="bg-primary text-white p-2 rounded-r-lg hover:bg-secondary">
						<Search size={20} />
					</button>
				</form>
			</div>

			{/* BẢNG (TABLE) */}
			<div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
				{loading ? (
					<p className="text-center text-gray-500">Đang tải...</p>
				) : users.length === 0 ? (
					<p className="text-center text-gray-500">
						Không tìm thấy người dùng nào.
					</p>
				) : (
					<>
						<table className="min-w-full border-collapse">
							<thead className="bg-gray-100 text-gray-700">
								<tr>
									<th className="py-3 px-4 text-left">Tên</th>
									<th className="py-3 px-4 text-left">Email</th>
									<th className="py-3 px-4 text-left">Vai trò</th>
									<th className="py-3 px-4 text-left">Trạng thái</th>
									<th className="py-3 px-4 text-center">Hành động</th>
								</tr>
							</thead>
							<tbody>
								{users.map((u) => (
									<tr
										key={u._id}
										className="border-t hover:bg-gray-50 transition">
										<td className="py-3 px-4 font-medium text-gray-800">
											{u.name}
										</td>
										<td className="py-3 px-4 text-gray-700">{u.email}</td>
										<td className="py-3 px-4">
											{u.role === "admin" ? (
												<span className="font-semibold text-primary">
													Admin
												</span>
											) : (
												"User"
											)}
										</td>
										<td className="py-3 px-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${
													u.locked
														? "bg-red-100 text-red-600"
														: "bg-green-100 text-green-600"
												}`}>
												{u.locked ? "Bị khóa" : "Hoạt động"}
											</span>
										</td>
										<td className="py-3 px-4 text-center">
											{/*  Đổi sang nút Icon */}
											{u.role !== "admin" && ( // Ngăn admin tự khóa mình
												<>
													{!u.locked ? (
														<button
															onClick={() => lock(u._id)}
															className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200 transition"
															title="Khóa tài khoản">
															<Lock size={18} />
														</button>
													) : (
														<button
															onClick={() => unlock(u._id)}
															className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition"
															title="Mở khóa tài khoản">
															<Unlock size={18} />
														</button>
													)}
												</>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* THANH PHÂN TRANG */}
						{totalPages > 1 && (
							<div className="flex justify-center items-center gap-4 mt-6">
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
					</>
				)}
			</div>
		</div>
	);
}
