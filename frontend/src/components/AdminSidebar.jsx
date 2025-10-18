import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
	const location = useLocation();

	const links = [
		{ to: "/admin", label: "📊 Tổng quan" },
		{ to: "/admin/products", label: "📦 Sản phẩm" },
		{ to: "/admin/orders", label: "🧾 Đơn hàng" },
		{ to: "/admin/users", label: "👥 Người dùng" },
		{ to: "/admin/categories", label: "🗂 Danh mục & Thương hiệu" },
		{ to: "/admin/reports", label: "📈 Báo cáo" },
	];

	return (
		<aside className="w-60 bg-gray-900 text-white h-screen p-5 space-y-4">
			<h2 className="text-xl font-bold mb-4 text-center">Admin Panel</h2>
			<nav className="flex flex-col space-y-2">
				{links.map((link) => (
					<Link
						key={link.to}
						to={link.to}
						className={`px-3 py-2 rounded-md hover:bg-gray-700 ${
							location.pathname === link.to ? "bg-gray-700" : ""
						}`}>
						{link.label}
					</Link>
				))}
			</nav>
		</aside>
	);
}
