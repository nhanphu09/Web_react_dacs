import { LogOut, Package, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";

// Component Sidebar cho trang Profile
const ProfileSidebar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/"); // Về trang chủ sau khi logout
	};

	const navLinks = [
		{ to: "/profile", label: "Thông tin cá nhân", icon: User },
		{ to: "/orders", label: "Lịch sử đơn hàng", icon: Package },
	];

	return (
		// 'w-full' cho mobile, 'md:w-64' cho desktop. Rất tốt!
		<aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-lg">
			<nav className="flex flex-col space-y-3">
				{navLinks.map((link) => (
					<Link
						key={link.to}
						to={link.to}
						className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
							location.pathname === link.to
								? "bg-primary text-white shadow"
								: "text-gray-700 hover:bg-gray-100"
						}`}>
						<link.icon size={20} />
						{link.label}
					</Link>
				))}
				{/* Nút Đăng xuất */}
				<button
					onClick={handleLogout}
					className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all">
					<LogOut size={20} />
					Đăng xuất
				</button>
			</nav>
		</aside>
	);
};

// Component Profile chính
export default function Profile() {
	const { user, updateProfile } = useAuth();
	const [name, setName] = useState(user?.name || "");
	const [email, setEmail] = useState(user?.email || "");
	const [password, setPassword] = useState("");

	const handleSave = async () => {
		await updateProfile({ name, email, password: password || undefined });
		toast.success("Thông tin cá nhân đã được cập nhật!");
		setPassword(""); // clear password sau khi lưu
	};

	return (
		// Bố cục 2 cột
		// --- THAY ĐỔI: Giảm padding (p-4) và lề (mt-4) trên mobile ---
		<div className="max-w-7xl mx-auto p-4 md:p-6 mt-4 md:mt-10">
			{/* Tiêu đề trang */}
			{/* --- THAY ĐỔI: Giảm cỡ chữ (text-2xl) trên mobile --- */}
			<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
				Tài khoản của tôi
			</h2>

			{/* Đây là class responsive quan trọng, và bạn đã làm đúng */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* CỘT 1: SIDEBAR */}
				<div className="md:col-span-1">
					<ProfileSidebar />
				</div>

				{/* CỘT 2: NỘI DUNG (FORM) */}
				<div className="md:col-span-3">
					{/* --- THAY ĐỔI: Giảm padding (p-6) trên mobile --- */}
					<div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
						<h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
							Thông tin cá nhân
						</h3>

						<div className="space-y-4">
							<div>
								<label className="block text-gray-700 font-medium mb-1">
									Họ và tên
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-1">
									Email
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-1">
									Mật khẩu mới
								</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Để trống nếu không đổi"
									className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							{/* Đổi màu nút sang 'bg-primary' */}
							<button
								onClick={handleSave}
								className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition duration-200">
								Lưu thay đổi
							</button>
						</div>

						<div className="mt-6 text-center text-sm text-gray-500">
							<p>
								Đăng nhập bằng tài khoản:{" "}
								<span className="font-medium text-gray-700">{user?.email}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
