import { Minus, Plus } from "lucide-react";

export default function QuantityInput({
	value,
	onDecrease,
	onIncrease,
	onChange,
}) {
	const handleInputChange = (e) => {
		const num = parseInt(e.target.value, 10);
		// Đảm bảo giá trị luôn là số và >= 1
		if (isNaN(num) || num < 1) {
			onChange(1);
		} else {
			onChange(num);
		}
	};

	return (
		<div className="flex items-center border border-gray-300 rounded-md w-fit">
			{/* Nút Trừ */}
			<button
				onClick={onDecrease}
				className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={value <= 1}>
				<Minus size={16} />
			</button>

			{/* Ô nhập số */}
			<input
				type="number"
				min="1"
				value={value}
				onChange={handleInputChange}
				className="w-12 border-l border-r text-center focus:outline-none"
			/>

			{/* Nút Cộng */}
			<button
				onClick={onIncrease}
				className="px-3 py-2 text-gray-600 hover:bg-gray-100">
				<Plus size={16} />
			</button>
		</div>
	);
}
