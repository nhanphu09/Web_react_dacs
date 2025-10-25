import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar"; // 🟢 Đảm bảo đường dẫn này đúng

export default function AdminLayout() {
	return (
		<div className="flex">
			{/* 1. Thanh Sidebar */}
			<AdminSidebar />

			{/* 2. Nội dung trang (Dashboard, Products, Orders...) */}
			<main className="flex-1">
				<Outlet /> {/* 🟢 Đây là nơi nội dung trang con sẽ được render */}
			</main>
		</div>
	);
}
