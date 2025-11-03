import { ChevronRight, HardDrive } from "lucide-react";
import { useEffect, useState } from "react";
import { FaMobileAlt, FaTshirt } from "react-icons/fa";
import { GiPerfumeBottle, GiSonicShoes } from "react-icons/gi";
import { MdOutlineComputer, MdOutlineFastfood } from "react-icons/md";
import {
	SiApple,
	SiCocacola,
	SiNike,
	SiOppo,
	SiSamsung,
	SiSony,
} from "react-icons/si";
import { Link } from "react-router-dom";
import api from "../api/client";

// Helper để chọn icon
const getIcon = (name) => {
	const lowerName = name.toLowerCase();

	if (lowerName.includes("máy tính")) return <MdOutlineComputer size={20} />;
	if (lowerName.includes("điện thoại")) return <FaMobileAlt size={20} />;
	if (lowerName.includes("quần áo")) return <FaTshirt size={20} />;
	if (lowerName.includes("chăm sóc")) return <GiPerfumeBottle size={20} />;
	if (lowerName.includes("thực phẩm")) return <MdOutlineFastfood size={20} />;
	if (lowerName.includes("giày dép")) return <GiSonicShoes size={20} />;
	return <HardDrive size={20} />; // Icon mặc định
};

const getBrandIcon = (name) => {
	const lowerName = name.toLowerCase();
	if (lowerName.includes("apple")) return <SiApple size={20} />;
	if (lowerName.includes("samsung")) return <SiSamsung size={20} />;
	if (lowerName.includes("oppo")) return <SiOppo size={32} />;
	if (lowerName.includes("sony")) return <SiSony size={32} />;
	if (lowerName.includes("coca-cola")) return <SiCocacola size={32} />;
	if (lowerName.includes("nike")) return <SiNike size={32} />;
	return null;
};

export default function MegaMenu() {
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [catRes, brandRes] = await Promise.all([
					api.get("/categories"),
					api.get("/brands"),
				]);
				setCategories(catRes.data);
				setBrands(brandRes.data);
			} catch (err) {
				console.error("Failed to fetch mega menu data", err);
			}
		};
		fetchData();
	}, []);

	return (
		// Container: Định vị tuyệt đối, nằm ngay dưới Navbar
		<div className="absolute top-full left-0 w-full bg-white text-black shadow-lg z-50 border-t border-gray-200">
			<div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Cột 1: Danh mục */}
				<div>
					<h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">
						Danh mục
					</h3>
					<div className="space-y-3">
						{categories.map((cat) => (
							<Link
								key={cat._id}
								to={`/products?category=${cat._id}`}
								className="flex items-center gap-3 p-2 rounded-full hover:bg-gray-100 transition group">
								<span className="text-primary">{getIcon(cat.name)}</span>
								<span className="font-semibold text-gray-700 group-hover:text-primary">
									{cat.name}
								</span>
								<ChevronRight size={16} className="ml-auto text-gray-400" />
							</Link>
						))}
					</div>
				</div>

				{/* Cột 2: Thương hiệu */}
				<div>
					<h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">
						Thương hiệu
					</h3>
					<div className="flex flex-wrap gap-3">
						{brands.map((brand) => {
							const BrandIcon = getBrandIcon(brand.name);
							return (
								<Link
									key={brand._id}
									to={`/products?brand=${brand._id}`}
									className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 hover:text-primary transition flex items-center gap-2">
									{/* Nếu có icon thì hiển thị */}
									{BrandIcon}
									{brand.name}
								</Link>
							);
						})}
					</div>
				</div>

				{/* Cột 3: Liên kết khác */}
				<div>
					<h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">
						Dịch vụ & Tiện ích
					</h3>
					<div className="space-y-3">
						<Link
							to="#"
							className="block p-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
							Máy cũ giá rẻ
						</Link>
						<Link
							to="#"
							className="block p-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
							Thông tin hay
						</Link>
						<Link
							to="#"
							className="block p-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
							Sim thẻ, Thu hộ
						</Link>
						<Link
							to="#"
							className="block p-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
							Khuyến mãi doanh nghiệp
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
