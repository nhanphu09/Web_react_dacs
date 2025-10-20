import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Login() {
	const { login, user } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	// Nếu user đã đăng nhập (tồn tại trong context) => chuyển hướng ngay
	useEffect(() => {
		if (user) {
			console.log("USER từ context:", user);

			const isAdmin = user.isAdmin || user.role === "admin";
			navigate(isAdmin ? "/admin" : "/");
		}
	}, [user, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const userData = await login(email, password);

			if (userData) {
				alert("Login successful!");
				const isAdmin = userData.isAdmin || userData.role === "admin";
				navigate(isAdmin ? "/admin" : "/");
			} else {
				alert("Invalid email or password!");
			}
		} catch (error) {
			console.error("Login error:", error);
			alert("Login failed! Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<h2 className="text-2xl font-bold text-center text-primary mb-6">
					🔐 Login to Your Account
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							className="mt-1 w-full border rounded-lg px-3 py-2"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							className="mt-1 w-full border rounded-lg px-3 py-2"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark">
						Login
					</button>
				</form>

				<p className="text-center text-gray-600 mt-4 text-sm">
					Don't have an account?{" "}
					<span
						onClick={() => navigate("/register")}
						className="text-primary font-semibold cursor-pointer hover:underline">
						Register here
					</span>
				</p>
			</div>
		</div>
	);
}
