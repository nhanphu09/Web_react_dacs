// src/components/CategoryNav.jsx

import { Laptop, Phone, Plug, Smartphone } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client"; // Import API client của bạn

export default function CategoryNav() {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await api.get("/categories");
				setCategories(res.data);
			} catch (err) {
				console.error("Failed to fetch categories for nav", err);
			}
		};
		fetchCategories();
	}, []);

	// Helper để chọn biểu tượng (icon) dựa trên tên
	const getIconForCategory = (categoryName) => {
		if (categoryName.toLowerCase().includes("điện tử")) {
			return <Smartphone size={16} />; // 🟢 SỬA: Dùng tên icon đúng
		}
		if (categoryName.toLowerCase().includes("laptop")) {
			return <Laptop size={16} />;
		}
		if (categoryName.toLowerCase().includes("phụ kiện")) {
			return <Plug size={16} />;
		}
		return <Phone size={16} />; // Icon mặc định
	};

	return (
		<nav className="bg-white shadow-md sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-center items-center h-12 space-x-6">
					{categories.map((cat) => (
						<Link
							key={cat._id}
							to={`/products?category=${cat._id}`}
							className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200">
							{/* 🟢 SỬA: Bỏ comment để hiển thị icon */}
							<span>{getIconForCategory(cat.name)}</span>
							<span>{cat.name}</span>
						</Link>
					))}
					<Link
						to="/products"
						className="flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors duration-200">
						Tất cả sản phẩm
					</Link>
				</div>
			</div>
		</nav>
	);
}
