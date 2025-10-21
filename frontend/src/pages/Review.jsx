import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function Review() {
	const { id } = useParams(); // productId
	const [reviews, setReviews] = useState([]);
	const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

	useEffect(() => {
		api.get(`/products/${id}/reviews`).then((res) => setReviews(res.data));
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await api.post(`/products/${id}/reviews`, newReview);
		setReviews([...reviews, res.data]);
		setNewReview({ rating: 5, comment: "" });
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">
				Đánh giá sản phẩm
			</h2>

			<form
				onSubmit={handleSubmit}
				className="space-y-4 border-b pb-6 mb-6 border-gray-200">
				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Điểm đánh giá (1–5)
					</label>
					<input
						type="number"
						min="1"
						max="5"
						value={newReview.rating}
						onChange={(e) =>
							setNewReview({ ...newReview, rating: e.target.value })
						}
						className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
					/>
				</div>

				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Nội dung đánh giá
					</label>
					<textarea
						value={newReview.comment}
						onChange={(e) =>
							setNewReview({ ...newReview, comment: e.target.value })
						}
						className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
						placeholder="Nhập nội dung đánh giá..."
						required
					/>
				</div>

				<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
					Gửi đánh giá
				</button>
			</form>

			<h3 className="text-xl font-semibold mb-4 text-gray-800">
				Các đánh giá khác
			</h3>

			<div className="space-y-3">
				{reviews.length === 0 ? (
					<p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
				) : (
					reviews.map((r) => (
						<div
							key={r._id}
							className="border border-gray-200 rounded p-4 hover:bg-gray-50 transition">
							<div className="font-semibold text-yellow-500">
								⭐ {r.rating}/5
							</div>
							<p className="text-gray-700 mt-1">{r.comment}</p>
							<p className="text-sm text-gray-500 mt-1">
								{new Date(r.createdAt).toLocaleString("vi-VN")}
							</p>
						</div>
					))
				)}
			</div>
		</div>
	);
}
