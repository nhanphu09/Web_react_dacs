import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<nav className="flex justify-between items-center px-6 py-3 bg-primary text-white shadow-md">
			{/* Logo */}
			<div className="flex items-center space-x-2">
				<Link to="/" className="text-2xl font-bold tracking-wide">
					FPT<span className="text-secondary">Shop</span>
				</Link>
			</div>

			{/* Center menu */}
			<div className="hidden md:flex space-x-6 text-sm font-medium">
				<Link to="/" className="hover:text-secondary transition">
					Home
				</Link>
				<Link to="/products" className="hover:text-secondary transition">
					Products
				</Link>
				<Link to="/cart" className="hover:text-secondary transition">
					Cart
				</Link>
			</div>

			{/* Right menu (user info) */}
			<div className="flex items-center space-x-4 text-sm">
				{!user && (
					<>
						<Link to="/login" className="hover:text-secondary transition">
							Login
						</Link>
						<Link to="/register" className="hover:text-secondary transition">
							Register
						</Link>
					</>
				)}

				{user && (
					<>
						<Link
							to="/profile"
							className="font-medium hover:text-secondary transition">
							{user.name || "Profile"}
						</Link>

						{user.role === "admin" && (
							<Link to="/admin" className="hover:text-secondary transition">
								Admin
							</Link>
						)}

						<button
							onClick={handleLogout}
							className="bg-white text-primary px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition">
							Logout
						</button>
					</>
				)}
			</div>
		</nav>
	);
}
