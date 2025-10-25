import React from "react";
export default function AdminDashboard() {
	return (
		<div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">
				📊 Admin Dashboard
			</h2>
			<p className="text-gray-600">
				Chào mừng Admin! Sử dụng thanh điều hướng bên cạnh để quản lý:{" "}
				{/* 🟢 SỬA */}
			</p>
			<ul className="list-disc list-inside text-gray-700 mt-2">
				<li>🛍️ Products</li>
				<li>🧾 Orders</li>
				<li>👤 Users</li>
				<li>📈 Reports</li>
			</ul>
		</div>
	);
}
