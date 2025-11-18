import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
	// 1. State để quản lý việc mở/đóng sidebar trên di động
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="relative flex min-h-screen bg-gray-50">
			{/* 2. Overlay (che mờ) */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
					onClick={() => setIsSidebarOpen(false)}></div>
			)}

			{/* 3. Thanh Sidebar */}
			<div
				className={`
          fixed md:relative z-30
          h-screen
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}>
				<div className="relative h-full">
					<AdminSidebar />
					{/* Nút đóng sidebar trên mobile (tùy chọn) */}
					<button
						className="absolute top-4 right-4 text-white md:hidden"
						onClick={() => setIsSidebarOpen(false)}></button>
				</div>
			</div>

			{/* 4. Nội dung trang chính */}
			<main className="flex-1">
				{/* 5. Header cho Mobile (Nguyên nhân gây lỗi trước đó là ở đây) */}
				<header className="md:hidden sticky top-0 bg-white shadow z-10">
					<div className="flex items-center justify-between p-4">
						{/* Thẻ Link này cần được import ở trên cùng */}
						<Link
							to="/"
							className="text-xl font-bold tracking-wide text-primary">
							PKA<span className="text-secondary">Shop</span>
						</Link>
						<button onClick={() => setIsSidebarOpen(true)}>
							<Menu size={24} className="text-gray-700" />
						</button>
					</div>
				</header>

				<Outlet />
			</main>
		</div>
	);
}
