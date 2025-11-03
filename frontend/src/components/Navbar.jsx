import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import MegaMenu from "./MegaMenu.jsx"; // Phải import

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	let leaveTimer;
	const handleMouseLeave = () => {
		leaveTimer = setTimeout(() => {
			setIsMenuOpen(false);
		}, 200);
	};

	const handleMouseEnter = () => {
		clearTimeout(leaveTimer);
		setIsMenuOpen(true);
	};

	return (
		<nav
			className="relative bg-primary text-white shadow-md z-50"
			onMouseLeave={handleMouseLeave}>
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center h-20 gap-4">
					{/* Logo */}
					<Link to="/" className="text-2xl font-bold tracking-wide">
						PKA<span className="text-secondary">Shop</span>
					</Link>

					{/* 2. Nút Danh mục */}
					<button
						className="flex-shrink-0 bg-black bg-opacity-10 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-opacity-20 transition"
						// 4. Hiện menu khi di chuột VÀO NÚT
						onMouseEnter={handleMouseEnter}>
						<Menu size={20} />
						<span className="font-medium">Danh mục</span>
					</button>

					{/* Thanh Tìm kiếm */}
					<form className="flex-1 max-w-xl">
						<div className="relative">
							<input
								type="search"
								placeholder="Nhập tên điện thoại, laptop, phụ kiện... cần tìm"
								className="w-full h-12 px-4 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
							/>
							<button
								type="submit"
								className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-gray-500 hover:text-primary">
								<Search size={20} />
							</button>
						</div>
					</form>

					{/* Đăng nhập / Tài khoản */}
					{!user ? (
						<Link
							to="/login"
							className="flex-shrink-0 flex items-center gap-2 p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition">
							<User size={20} />
							<span className="text-sm font-medium">Đăng nhập</span>
						</Link>
					) : (
						<div className="flex items-center gap-2">
							<Link
								to={user.role === "admin" ? "/admin" : "/profile"}
								className="flex-shrink-0 flex items-center gap-2 p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition">
								<User size={20} />
								<span className="text-sm font-medium">{user.name}</span>
							</Link>
							<button
								onClick={handleLogout}
								className="bg-white text-primary px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-200 transition">
								Logout
							</button>
						</div>
					)}

					{/* Giỏ hàng */}
					<Link
						to="/cart"
						className="flex-shrink-0 bg-black bg-opacity-10 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-20 transition">
						<ShoppingCart size={20} />
						<span className="font-medium">Giỏ hàng</span>
					</Link>
				</div>
			</div>

			{/* 5. Mega Menu nằm ở đây, 'absolute' so với <nav> */}
			{isMenuOpen && (
				<div
					onMouseEnter={handleMouseEnter} // Giữ menu mở khi di chuột vào
				>
					<MegaMenu />
				</div>
			)}
		</nav>
	);
}
