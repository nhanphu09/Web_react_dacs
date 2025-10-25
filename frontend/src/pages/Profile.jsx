import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";

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
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
					Thông tin cá nhân
				</h2>

				<div className="space-y-4">
					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Họ và tên
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						onClick={handleSave}
						className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200">
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
	);
}
