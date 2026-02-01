import { CheckCircle, CreditCard, MapPin, Phone, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";
import { useAuth } from "../context/AuthProvider";

export default function Checkout() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		line1: "",
		city: "",
		paymentMethod: "COD"
	});

	// Load Cart và điền thông tin User
	useEffect(() => {
		const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
		if (storedCart.length === 0) {
			toast.warn("Giỏ hàng trống!");
			navigate("/products");
			return;
		}
		setCart(storedCart);

		if (user) {
			setFormData(prev => ({
				...prev,
				name: user.name || "",
				email: user.email || ""
			}));
		}
	}, [user, navigate]);

	// Tính toán tiền
	const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
	const shipping = subtotal > 1000000 ? 0 : 30000;
	const total = subtotal + shipping;

	const handlePlaceOrder = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const orderPayload = {
				products: cart.map(item => ({
					product: item.product,
					quantity: item.qty
				})),
				totalPrice: total,
				paymentMethod: formData.paymentMethod,
				shippingAddress: {
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					line1: formData.line1,
					city: formData.city,
					postal: "10000"
				}
			};

			const { data } = await api.post("/orders", orderPayload);

			toast.success(`Đặt hàng thành công! Mã đơn: #${data._id.slice(-6)}`);
			localStorage.removeItem("cart"); // Xóa giỏ hàng
			navigate("/orders"); // Chuyển đến trang lịch sử
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.message || "Đặt hàng thất bại.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
			<h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
				<CheckCircle className="text-primary" /> Xác nhận thanh toán
			</h2>

			<form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
				{/* Cột Trái: Thông tin */}
				<div className="flex-1 space-y-6">
					<div className="bg-white p-6 rounded-xl shadow-sm border">
						<h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
							<MapPin size={20} className="text-primary" /> Địa chỉ giao hàng
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1">
								<label className="text-sm font-medium text-gray-700">Họ và tên</label>
								<div className="relative">
									<User className="absolute left-3 top-2.5 text-gray-400" size={18} />
									<input
										required
										type="text"
										className="w-full border rounded-lg pl-10 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									/>
								</div>
							</div>
							<div className="space-y-1">
								<label className="text-sm font-medium text-gray-700">Số điện thoại</label>
								<div className="relative">
									<Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
									<input
										required
										type="tel"
										className="w-full border rounded-lg pl-10 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
										value={formData.phone}
										onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									/>
								</div>
							</div>
						</div>

						<div className="mt-4 space-y-1">
							<label className="text-sm font-medium text-gray-700">Email nhận thông báo</label>
							<input
								required
								type="email"
								className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="md:col-span-2 space-y-1">
								<label className="text-sm font-medium text-gray-700">Địa chỉ (Số nhà, đường)</label>
								<input
									required
									type="text"
									className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
									value={formData.line1}
									onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
								/>
							</div>
							<div className="space-y-1">
								<label className="text-sm font-medium text-gray-700">Tỉnh / Thành phố</label>
								<input
									required
									type="text"
									className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
									value={formData.city}
									onChange={(e) => setFormData({ ...formData, city: e.target.value })}
								/>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border">
						<h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
							<CreditCard size={20} className="text-primary" /> Phương thức thanh toán
						</h3>
						<div className="space-y-3">
							<label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
								<input
									type="radio"
									name="payment"
									value="COD"
									checked={formData.paymentMethod === "COD"}
									onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
									className="w-5 h-5 text-primary focus:ring-primary"
								/>
								<span className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
							</label>
						</div>
					</div>
				</div>

				{/* Cột Phải: Tổng kết */}
				<div className="w-full lg:w-96">
					<div className="bg-white p-6 rounded-xl shadow-lg border sticky top-24">
						<h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Đơn hàng của bạn</h3>

						<div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
							{cart.map(item => (
								<div key={item.product} className="flex justify-between items-center text-sm">
									<div className="flex items-center gap-2">
										<span className="font-bold text-gray-500">{item.qty}x</span>
										<span className="text-gray-800 truncate max-w-[150px]" title={item.title}>{item.title}</span>
									</div>
									<span className="font-medium">
										{(item.price * item.qty).toLocaleString("vi-VN")} đ
									</span>
								</div>
							))}
						</div>

						<div className="border-t pt-4 space-y-2 text-gray-600">
							<div className="flex justify-between">
								<span>Tạm tính</span>
								<span>{subtotal.toLocaleString("vi-VN")} đ</span>
							</div>
							<div className="flex justify-between">
								<span>Phí vận chuyển</span>
								<span>{shipping === 0 ? "0 đ" : shipping.toLocaleString("vi-VN") + " đ"}</span>
							</div>
							<div className="flex justify-between text-xl font-bold text-primary pt-2 border-t mt-2">
								<span>Tổng cộng</span>
								<span>{total.toLocaleString("vi-VN")} đ</span>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition shadow-lg disabled:opacity-70 flex justify-center items-center gap-2">
							{loading ? "Đang xử lý..." : <><Truck size={20} /> Đặt hàng ngay</>}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}