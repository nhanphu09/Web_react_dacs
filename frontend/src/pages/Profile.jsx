import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ProfileSidebar from "../components/ProfileSidebar";
import { useAuth } from "../context/AuthProvider";

export default function Profile() {
	const { user, updateProfile } = useAuth();

	const [name, setName] = useState(user?.name || "");
	const [email, setEmail] = useState(user?.email || "");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password && password !== confirmPassword) {
			return toast.error("Mật khẩu xác nhận không khớp!");
		}

		try {
			await updateProfile({ name, email, password });
			toast.success("Cập nhật hồ sơ thành công!");
			setPassword("");
			setConfirmPassword("");
		} catch (err) {
			toast.error("Cập nhật thất bại.");
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar */}
				<ProfileSidebar />

				{/* Nội dung chính */}
				<div className="flex-1 bg-white rounded-xl shadow-lg p-6 md:p-8">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
						Thông tin cá nhân
					</h2>

					<form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
							<div className="relative">
								<User className="absolute left-3 top-2.5 text-gray-400" size={20} />
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
							<div className="relative">
								<Mail className="absolute left-3 top-2.5 text-gray-400" size={20} />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
								/>
							</div>
						</div>

						<div className="border-t pt-6 mt-6">
							<h3 className="text-lg font-semibold mb-4 text-gray-700">Đổi mật khẩu</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
									<div className="relative">
										<Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
										<input
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Bỏ trống nếu không đổi"
											className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
									<div className="relative">
										<Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
										<input
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											placeholder="Nhập lại mật khẩu mới"
											className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
										/>
									</div>
								</div>
							</div>
						</div>

						<button
							type="submit"
							className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md">
							Lưu thay đổi
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}