import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";

export default function Review() {
	const { id } = useParams(); // Lấy ID sản phẩm từ URL
	const navigate = useNavigate();

	const [product, setProduct] = useState(null);
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(false);

	// 1. Lấy thông tin sản phẩm để hiển thị (UX tốt hơn)
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const { data } = await api.get(`/products/${id}`);
				setProduct(data);
			} catch (err) {
				toast.error("Không tìm thấy sản phẩm này.");
				navigate("/orders");
			}
		};
		fetchProduct();
	}, [id, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!comment.trim()) {
			return toast.warning("Vui lòng nhập nội dung đánh giá!");
		}

		setLoading(true);
		try {
			await api.post(`/products/${id}/reviews`, { rating, comment });
			toast.success("Cảm ơn bạn đã đánh giá!");
			navigate(`/product/${id}`); // Quay lại trang chi tiết sản phẩm
		} catch (err) {
			toast.error(err.response?.data?.message || "Lỗi khi gửi đánh giá.");
		} finally {
			setLoading(false);
		}
	};

	if (!product) return <div className="p-10 text-center">Đang tải...</div>;

	return (
		<div className="max-w-xl mx-auto p-4 md:p-8 min-h-screen">
			<div className="bg-white rounded-xl shadow-lg p-8">
				<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
					Đánh giá sản phẩm
				</h2>

				{/* Thông tin sản phẩm */}
				<div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg border">
					<img
						src={product.image}
						alt={product.title}
						className="w-16 h-16 object-contain mix-blend-multiply"
					/>
					<div>
						<p className="font-semibold text-gray-800 line-clamp-1">{product.title}</p>
						<p className="text-sm text-gray-500">{product.brand?.name}</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Chọn sao */}
					<div>
						<label className="block font-medium mb-3 text-gray-700 text-center">
							Bạn cảm thấy thế nào về sản phẩm?
						</label>
						<div className="flex gap-2 justify-center">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									className="focus:outline-none transition-transform hover:scale-110 active:scale-95">
									<Star
										size={40}
										fill={star <= rating ? "#FBBF24" : "none"} // Màu vàng hoặc rỗng
										className={star <= rating ? "text-yellow-400" : "text-gray-300"}
									/>
								</button>
							))}
						</div>
						<p className="text-center text-sm text-primary font-medium mt-2">
							{rating === 5 ? "Tuyệt vời! 😍" : rating === 1 ? "Rất tệ 😭" : rating === 4 ? "Hài lòng 🙂" : rating === 3 ? "Bình thường 😐" : "Không thích 😞"}
						</p>
					</div>

					{/* Nhập nội dung */}
					<div>
						<label className="block font-medium mb-2 text-gray-700">Nhận xét chi tiết</label>
						<textarea
							rows={4}
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Hãy chia sẻ trải nghiệm của bạn về chất lượng, tính năng..."
							className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none resize-none"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-lg disabled:opacity-50">
						{loading ? "Đang gửi..." : "Gửi đánh giá"}
					</button>
				</form>
			</div>
		</div>
	);
}