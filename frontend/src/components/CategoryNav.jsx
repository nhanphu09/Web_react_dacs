import { useEffect, useState } from "react";
import { FaTshirt } from "react-icons/fa";
import { GiPerfumeBottle } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";
import { IoSparkles } from "react-icons/io5";
import {
	MdOutlineComputer,
	MdOutlineFastfood,
	MdOutlineLocalDrink,
	MdPhoneIphone,
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../api/client";

const getIconForCategory = (categoryName) => {
	const lowerName = categoryName.toLowerCase();

	if (lowerName.includes("máy tính")) return <MdOutlineComputer size={16} />;
	if (lowerName.includes("điện thoại")) return <MdPhoneIphone size={16} />;
	if (lowerName.includes("quần áo")) return <FaTshirt size={16} />;
	if (lowerName.includes("chăm sóc")) return <GiPerfumeBottle size={16} />;
	if (lowerName.includes("thực phẩm")) return <MdOutlineFastfood size={16} />;
	if (lowerName.includes("tài chính")) return <GrMoney size={16} />;
	if (lowerName.includes("đồ uống")) return <MdOutlineLocalDrink size={16} />;

	return <IoSparkles size={16} />; // Icon mặc định
};

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

	return (
		<nav className="bg-white shadow-md sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-center items-center h-12 space-x-6">
					{categories.map((cat) => (
						<Link
							key={cat._id}
							to={`/products?category=${cat._id}`}
							className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200">
							{/* Bỏ comment để hiển thị icon */}
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
