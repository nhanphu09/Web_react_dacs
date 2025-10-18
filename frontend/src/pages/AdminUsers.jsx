import React, { useEffect, useState } from "react";
import axios from "../utils/api";

export default function AdminUsers() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		axios
			.get("/admin/users")
			.then((r) => setUsers(r.data))
			.catch((err) => console.error(err));
	}, []);

	const lock = async (id) => {
		await axios.put(`/admin/users/${id}/lock`);
		setUsers(users.map((u) => (u._id === id ? { ...u, isLocked: true } : u)));
	};

	const unlock = async (id) => {
		await axios.put(`/admin/users/${id}/unlock`);
		setUsers(users.map((u) => (u._id === id ? { ...u, isLocked: false } : u)));
	};

	return (
		<div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				👤 Quản lý người dùng
			</h2>

			{users.length === 0 ? (
				<p className="text-center text-gray-500">Chưa có người dùng nào.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
						<thead className="bg-gray-100 text-gray-700">
							<tr>
								<th className="py-3 px-4 text-left">#</th>
								<th className="py-3 px-4 text-left">Tên</th>
								<th className="py-3 px-4 text-left">Email</th>
								<th className="py-3 px-4 text-left">Vai trò</th>
								<th className="py-3 px-4 text-left">Trạng thái</th>
								<th className="py-3 px-4 text-center">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{users.map((u, idx) => (
								<tr
									key={u._id}
									className="border-t hover:bg-gray-50 transition">
									<td className="py-3 px-4 text-gray-600">{idx + 1}</td>
									<td className="py-3 px-4 font-medium text-gray-800">
										{u.name}
									</td>
									<td className="py-3 px-4 text-gray-700">{u.email}</td>
									<td className="py-3 px-4 text-gray-700">{u.role}</td>
									<td className="py-3 px-4">
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${
												u.isLocked
													? "bg-red-100 text-red-600"
													: "bg-green-100 text-green-600"
											}`}>
											{u.isLocked ? "Bị khóa" : "Hoạt động"}
										</span>
									</td>
									<td className="py-3 px-4 text-center">
										{!u.isLocked ? (
											<button
												onClick={() => lock(u._id)}
												className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition">
												Khóa
											</button>
										) : (
											<button
												onClick={() => unlock(u._id)}
												className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition">
												Mở khóa
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
