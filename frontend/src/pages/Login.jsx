import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Login() {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const submit = async (e) => {
		e.preventDefault();
		const ok = await login(email, password);
		if (ok) {
			alert("Login successful!");
			navigate("/");
		} else {
			alert("Invalid email or password!");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<h2 className="text-2xl font-bold text-center text-primary mb-6">
					🔐 Login to Your Account
				</h2>

				<form onSubmit={submit} className="space-y-4">
					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Email Address
						</label>
						<input
							type="email"
							placeholder="example@gmail.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Password
						</label>
						<input
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-secondary transition">
						Log In
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
