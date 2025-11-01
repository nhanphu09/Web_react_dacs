import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";

export default function Register() {
	const { register, loading } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const submit = async (e) => {
		e.preventDefault();
		try {
			await register(name, email, password);
			toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
			navigate("/login");
		} catch (e) {
			toast.error("Đăng ký thất bại. Email có thể đã tồn tại.");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
					Đăng ký tài khoản
				</h2>
				<form onSubmit={submit} className="space-y-4">
					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Họ và tên
						</label>
						<input
							type="text"
							placeholder="Nhập họ tên"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Email
						</label>
						<input
							type="email"
							placeholder="Nhập email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Mật khẩu
						</label>
						<input
							type="password"
							placeholder="Nhập mật khẩu"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
						disabled={loading}>
						{" "}
						{loading ? "Đang xử lý..." : "Đăng ký"}
					</button>
				</form>

				<p className="text-center text-gray-600 text-sm mt-4">
					Đã có tài khoản?{" "}
					<span
						className="text-blue-600 hover:underline cursor-pointer"
						onClick={() => navigate("/login")}>
						Đăng nhập
					</span>
				</p>
			</div>
		</div>
	);
}
