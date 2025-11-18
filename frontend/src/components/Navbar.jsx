import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import MegaMenu from "./MegaMenu.jsx";

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		setIsMobileMenuOpen(false);
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

	const handleNavClick = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<nav
			className="relative bg-primary text-white shadow-md z-50"
			onMouseLeave={handleMouseLeave}>
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center h-20 gap-4">
					{/* 1. Logo (Luôn hiển thị, không co giãn) */}
					<Link
						to="/"
						className="text-2xl font-bold tracking-wide flex-shrink-0"
						onClick={handleNavClick}>
						PKA<span className="text-secondary">Shop</span>
					</Link>

					{/* 2. Nút Hamburger (Chỉ hiện trên Mobile, đẩy sang phải) */}
					<button
						className="md:hidden p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition ml-auto"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>

					{/* 3. CONTAINER MENU DESKTOP (Quan trọng)
             - hidden: Ẩn trên mobile
             - md:flex: Hiện trên desktop
             - flex-1: Chiếm toàn bộ khoảng trống còn lại (để đẩy thanh tìm kiếm ra)
          */}
					<div className="hidden md:flex flex-1 items-center gap-4 justify-between">
						{/* Nút Danh mục */}
						<button
							className="flex-shrink-0 bg-black bg-opacity-10 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-opacity-20 transition"
							onMouseEnter={handleMouseEnter}>
							<Menu size={20} />
							<span className="font-medium">Danh mục</span>
						</button>

						{/* Thanh Tìm kiếm (Sẽ giãn ra nhờ flex-1) */}
						<form className="flex-1 max-w-xl mx-4">
							<div className="relative">
								<input
									type="search"
									placeholder="Nhập tên điện thoại, laptop..."
									// Thêm pr-12 để chữ không bị icon che
									className="w-full h-12 pl-4 pr-12 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
								/>
								<button
									type="submit"
									className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-gray-500 hover:text-primary">
									<Search size={20} />
								</button>
							</div>
						</form>

						{/* Khu vực Tài khoản & Giỏ hàng */}
						<div className="flex items-center gap-4 flex-shrink-0">
							{!user ? (
								<Link
									to="/login"
									className="flex items-center gap-2 p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition"
									onClick={handleNavClick}>
									<User size={20} />
									<span className="text-sm font-medium">Đăng nhập</span>
								</Link>
							) : (
								<div className="flex items-center gap-2">
									<Link
										to={user.role === "admin" ? "/admin" : "/profile"}
										className="flex items-center gap-2 p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition"
										onClick={handleNavClick}>
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

							<Link
								to="/cart"
								className="bg-black bg-opacity-10 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-20 transition"
								onClick={handleNavClick}>
								<ShoppingCart size={20} />
								<span className="font-medium">Giỏ hàng</span>
							</Link>
						</div>
					</div>
				</div>

				{/* 4. Menu Thả xuống cho Mobile (Giữ nguyên) */}
				{isMobileMenuOpen && (
					<div className="md:hidden pb-4 border-t border-white/20 mt-2 pt-2">
						<div className="flex flex-col gap-3 items-start">
							{/* Search Mobile */}
							<form className="w-full">
								<div className="relative">
									<input
										type="search"
										placeholder="Tìm kiếm..."
										className="w-full h-10 pl-4 pr-10 rounded-full text-gray-900 focus:outline-none"
									/>
									<button className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500">
										<Search size={18} />
									</button>
								</div>
							</form>

							{/* Links Mobile */}
							{!user ? (
								<Link
									to="/login"
									className="flex gap-3 w-full py-2"
									onClick={handleNavClick}>
									<User size={20} /> Đăng nhập
								</Link>
							) : (
								<div className="w-full space-y-2">
									<Link
										to="/profile"
										className="flex gap-3 w-full py-2"
										onClick={handleNavClick}>
										<User size={20} /> {user.name}
									</Link>
									<button
										onClick={handleLogout}
										className="flex gap-3 w-full py-2 text-left">
										Logout
									</button>
								</div>
							)}
							<Link
								to="/cart"
								className="flex gap-3 w-full py-2"
								onClick={handleNavClick}>
								<ShoppingCart size={20} /> Giỏ hàng
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Mega Menu */}
			{isMenuOpen && (
				<div onMouseEnter={handleMouseEnter}>
					<MegaMenu />
				</div>
			)}
		</nav>
	);
}
