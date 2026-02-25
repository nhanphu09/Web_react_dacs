import { CheckCircle, CreditCard, MapPin, Phone, Truck, User, QrCode, Plus, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";
import { useAuth } from "../context/AuthProvider";

export default function Checkout() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	// Lấy thông tin giảm giá từ state (nếu có)
	const { discountPercent = 0, discountAmount = 0 } = location.state || {};

	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(false);

	// ==========================================
	// 1. STATE QUẢN LÝ ĐỊA CHỈ & THANH TOÁN
	// ==========================================
	const [orderEmail, setOrderEmail] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("COD");

	// Dữ liệu sổ địa chỉ
	const [addresses, setAddresses] = useState([]);
	const [selectedAddressId, setSelectedAddressId] = useState("");
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newAddress, setNewAddress] = useState({ name: "", phone: "", street: "", city: "", isDefault: false });

	// ==========================================

	useEffect(() => {
		const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
		if (storedCart.length === 0) {
			toast.warn("Giỏ hàng trống!");
			navigate("/products");
			return;
		}
		setCart(storedCart);

		// Gán email mặc định nếu có user
		if (user) {
			setOrderEmail(user.email || "");

			// Lấy địa chỉ từ DB
			const fetchAddresses = async () => {
				try {
					// 👇 Lấy token từ bên trong cục 'user'
					const token = JSON.parse(localStorage.getItem("user"))?.token;

					if (!token) return; // Nếu không có token thì dừng luôn

					const { data } = await api.get("/users/addresses", {
						headers: { Authorization: `Bearer ${token}` }
					});

					setAddresses(data);

					if (data.length > 0) {
						const defaultAddr = data.find(a => a.isDefault);
						if (defaultAddr) setSelectedAddressId(defaultAddr._id);
						else setSelectedAddressId(data[0]._id);
					}
				} catch (error) {
					console.error("Lỗi lấy sổ địa chỉ:", error);
				}
			};
			fetchAddresses();
		}
	}, [user, navigate]);

	// --- TÍNH TOÁN TIỀN ---
	const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
	const shipping = subtotal > 1000000 ? 0 : 30000;
	const total = subtotal - discountAmount + shipping;

	const formatCurrency = (amount) => {
		return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
	};

	// --- XỬ LÝ LƯU ĐỊA CHỈ MỚI ---
	const handleSaveNewAddress = async (e) => {
		e.preventDefault();
		if (!newAddress.name || !newAddress.phone || !newAddress.street || !newAddress.city) {
			return toast.warn("Vui lòng điền đầy đủ thông tin địa chỉ!");
		}

		try {
			// 👇 Sửa dòng lấy token ở đây
			const token = JSON.parse(localStorage.getItem("user"))?.token;

			if (!token) {
				return toast.error("Vui lòng đăng nhập để lưu địa chỉ!");
			}

			// 🟢 GỌI API LƯU ĐỊA CHỈ VÀO DATABASE
			const { data } = await api.post("/users/addresses", newAddress, {
				headers: { Authorization: `Bearer ${token}` }
			});

			setAddresses(data);

			const newlyAdded = data[data.length - 1];
			setSelectedAddressId(newlyAdded._id);

			setIsAddingNew(false);
			setNewAddress({ name: "", phone: "", street: "", city: "", isDefault: false });
			toast.success("Đã lưu địa chỉ vào sổ!");

		} catch (error) {
			toast.error("Lỗi khi lưu địa chỉ: " + error.message);
		}
	};

	// --- XỬ LÝ ĐẶT HÀNG ---
	const handlePlaceOrder = async (e) => {
		e.preventDefault();
		if (!orderEmail) return toast.warn("Vui lòng nhập Email nhận thông báo!");

		const selectedAddress = addresses.find(a => a._id === selectedAddressId);
		if (!selectedAddress) return toast.error("Vui lòng chọn địa chỉ giao hàng!");

		setLoading(true);

		try {
			const orderPayload = {
				products: cart.map(item => ({
					product: item.product,
					quantity: item.qty
				})),
				totalPrice: total,
				paymentMethod: paymentMethod,
				shippingAddress: {
					name: selectedAddress.name,
					email: orderEmail,
					phone: selectedAddress.phone,
					line1: selectedAddress.street,
					city: selectedAddress.city,
					postal: "10000"
				}
			};

			const { data } = await api.post("/orders", orderPayload);

			localStorage.removeItem("cart");
			window.dispatchEvent(new Event("storage"));

			if (paymentMethod === "BANKING") {
				navigate(`/payment/${data._id}`);
			} else {
				toast.success(`Đặt hàng thành công! Mã đơn: #${data._id.slice(-6).toUpperCase()}`);
				navigate("/orders");
			}

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

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Cột Trái: Thông tin */}
				<div className="flex-1 space-y-6">

					{/* --- SỔ ĐỊA CHỈ GIAO HÀNG --- */}
					<div className="bg-white p-6 rounded-xl shadow-sm border">
						<h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
							<MapPin size={20} className="text-primary" /> Địa chỉ giao hàng
						</h3>

						{/* Danh sách địa chỉ đã lưu */}
						<div className="space-y-3 mb-4">
							{addresses.map((addr) => (
								<div
									key={addr._id}
									onClick={() => setSelectedAddressId(addr._id)}
									className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddressId === addr._id ? "border-primary bg-red-50/30" : "border-gray-200 hover:border-red-200"
										}`}
								>
									{selectedAddressId === addr._id && (
										<div className="absolute top-3 right-3 text-primary"><Check size={20} strokeWidth={3} /></div>
									)}
									<div className="flex items-center gap-3 mb-1">
										<span className="font-bold text-gray-800">{addr.name}</span>
										<span className="text-gray-400">|</span>
										<span className="text-gray-600 font-medium">{addr.phone}</span>
										{addr.isDefault && (
											<span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-sm ml-2">Mặc định</span>
										)}
									</div>
									<p className="text-sm text-gray-600">{addr.street}</p>
									<p className="text-sm text-gray-600">{addr.city}</p>
								</div>
							))}
						</div>

						{/* Nút bật form thêm địa chỉ */}
						{!isAddingNew && (
							<button
								onClick={() => setIsAddingNew(true)}
								className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-primary hover:text-primary transition-colors mb-4"
							>
								<Plus size={18} /> Thêm địa chỉ mới
							</button>
						)}

						{/* Form thêm địa chỉ */}
						{isAddingNew && (
							<div className="mb-4 p-4 border rounded-lg bg-gray-50">
								<h4 className="font-bold text-gray-700 mb-3">Thông tin địa chỉ mới</h4>
								<div className="grid grid-cols-2 gap-4 mb-3">
									<input
										type="text" placeholder="Họ và tên" required
										className="w-full p-2 border rounded-md outline-none focus:border-primary"
										value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
									/>
									<input
										type="tel" placeholder="Số điện thoại" required
										className="w-full p-2 border rounded-md outline-none focus:border-primary"
										value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
									/>
								</div>
								<input
									type="text" placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã" required
									className="w-full p-2 border rounded-md outline-none focus:border-primary mb-3"
									value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
								/>
								<input
									type="text" placeholder="Địa chỉ cụ thể (Tên đường, số nhà...)" required
									className="w-full p-2 border rounded-md outline-none focus:border-primary mb-4"
									value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
								/>
								<label className="flex items-center gap-2 cursor-pointer mb-4 text-sm text-gray-700">
									<input
										type="checkbox" className="w-4 h-4 accent-primary"
										checked={newAddress.isDefault} onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
									/> Đặt làm địa chỉ mặc định
								</label>
								<div className="flex gap-3">
									<button onClick={() => setIsAddingNew(false)} className="flex-1 py-2 border border-gray-300 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition">Hủy</button>
									<button onClick={handleSaveNewAddress} className="flex-1 py-2 bg-primary text-white rounded-md font-medium hover:bg-red-600 transition">Lưu địa chỉ</button>
								</div>
							</div>
						)}

						{/* Tách riêng phần nhập Email (Bắt buộc để gửi bill) */}
						<div className="mt-6 pt-4 border-t">
							<label className="text-sm font-medium text-gray-700 block mb-1">Email nhận thông báo đơn hàng</label>
							<input
								required
								type="email"
								placeholder="vidu@gmail.com"
								className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
								value={orderEmail}
								onChange={(e) => setOrderEmail(e.target.value)}
							/>
						</div>
					</div>

					{/* --- PHƯƠNG THỨC THANH TOÁN --- */}
					<div className="bg-white p-6 rounded-xl shadow-sm border">
						<h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
							<CreditCard size={20} className="text-primary" /> Phương thức thanh toán
						</h3>
						<div className="space-y-3">
							<label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "COD" ? "border-primary bg-blue-50" : "hover:bg-gray-50"}`}>
								<input
									type="radio" name="payment" value="COD"
									checked={paymentMethod === "COD"}
									onChange={() => setPaymentMethod("COD")}
									className="w-5 h-5 text-primary focus:ring-primary"
								/>
								<span className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
							</label>

							<label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "BANKING" ? "border-primary bg-blue-50" : "hover:bg-gray-50"}`}>
								<input
									type="radio" name="payment" value="BANKING"
									checked={paymentMethod === "BANKING"}
									onChange={() => setPaymentMethod("BANKING")}
									className="w-5 h-5 text-primary focus:ring-primary"
								/>
								<div className="flex-1">
									<div className="flex items-center justify-between">
										<span className="font-medium text-gray-800">Chuyển khoản / Quét mã QR</span>
										<QrCode size={20} className="text-blue-600" />
									</div>
									<p className="text-xs text-gray-500 mt-1">Hỗ trợ tất cả App Ngân hàng & MoMo</p>
								</div>
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
								<div key={item.cartItemId || item.product} className="flex justify-between items-center text-sm">
									<div className="flex items-center gap-2">
										<span className="font-bold text-gray-500">{item.qty}x</span>
										<span className="text-gray-800 truncate max-w-[150px]" title={item.title}>{item.title}</span>
									</div>
									<span className="font-medium">
										{formatCurrency(item.price * item.qty)}
									</span>
								</div>
							))}
						</div>

						<div className="border-t pt-4 space-y-2 text-gray-600">
							<div className="flex justify-between">
								<span>Tạm tính</span>
								<span>{formatCurrency(subtotal)}</span>
							</div>

							{discountAmount > 0 && (
								<div className="flex justify-between text-green-600 font-medium">
									<span>Voucher giảm ({discountPercent}%)</span>
									<span>-{formatCurrency(discountAmount)}</span>
								</div>
							)}

							<div className="flex justify-between">
								<span>Phí vận chuyển</span>
								<span>{shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}</span>
							</div>

							<div className="flex justify-between text-xl font-bold text-primary pt-2 border-t mt-2">
								<span>Tổng cộng</span>
								<span>{formatCurrency(total)}</span>
							</div>
						</div>

						<button
							onClick={handlePlaceOrder}
							disabled={loading}
							className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
						>
							{loading ? "Đang xử lý..." : <><Truck size={20} /> Đặt hàng ngay</>}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}