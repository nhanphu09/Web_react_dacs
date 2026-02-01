import { LogOut, Package, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function ProfileSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const links = [
        { to: "/profile", label: "Thông tin tài khoản", icon: <User size={20} /> },
        { to: "/orders", label: "Lịch sử đơn hàng", icon: <Package size={20} /> },
    ];

    return (
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-lg p-6 h-fit">
            <nav className="flex flex-col space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === link.to
                                ? "bg-primary text-white shadow"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}>
                        {link.icon}
                        {link.label}
                    </Link>
                ))}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                    <LogOut size={20} />
                    Đăng xuất
                </button>
            </nav>
        </aside>
    );
}