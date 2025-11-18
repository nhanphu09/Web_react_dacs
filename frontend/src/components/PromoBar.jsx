import { ChevronDown, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const promoItems = [
	{ title: "Săn Deal Online", icon: "🔥" },
	{ title: "Voucher tặng bạn mới", icon: "🎁" },
	{ title: "Samsung mua 1 tặng 1", icon: "📱" },
	{ title: "Máy lọc nước từ 2.99 triệu", icon: "💧" },
];

export default function PromoBar() {
	return (
		// THÊM 'hidden md:block' VÀO ĐÂY
		<div className="hidden md:block bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 h-12 flex justify-between items-center">
				{/* Trái: Các khuyến mãi */}
				<div className="flex items-center gap-4">
					{promoItems.map((item, index) => (
						<Link
							key={index}
							to="/products"
							className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-primary transition">
							<span>{item.icon}</span>
							{item.title}
						</Link>
					))}
				</div>

				{/* Phải: Chọn khu vực */}
				<button className="flex items-center gap-1 text-sm text-gray-700 hover:text-primary transition">
					<MapPin size={16} />
					Chọn khu vực để xem ưu đãi
					<ChevronDown size={16} />
				</button>
			</div>
		</div>
	);
}
