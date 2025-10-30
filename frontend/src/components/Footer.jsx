import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-400 mt-20">
			<div className="max-w-7xl mx-auto px-4 py-16">
				{/* Phần trên: Các cột liên kết */}
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
					{/* Cột Logo/Giới thiệu */}
					<div className="col-span-2 lg:col-span-1">
						<h3 className="text-2xl font-bold text-white mb-3">
							PKA<span className="text-secondary">Shop</span>
						</h3>
						<p className="text-sm">Nơi mua sắm đáng tin cậy của bạn.</p>
						<div className="flex space-x-4 mt-4">
							<a
								href="#"
								className="hover:text-white transition"
								aria-label="Facebook">
								<Facebook size={20} />
							</a>
							<a
								href="#"
								className="hover:text-white transition"
								aria-label="Instagram">
								<Instagram size={20} />
							</a>
							<a
								href="#"
								className="hover:text-white transition"
								aria-label="Twitter">
								<Twitter size={20} />
							</a>
							<a
								href="#"
								className="hover:text-white transition"
								aria-label="GitHub">
								<Github size={20} />
							</a>
						</div>
					</div>

					{/* Cột Mua sắm */}
					<div>
						<h4 className="font-semibold text-white mb-4">Mua sắm</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link to="/products" className="hover:text-white transition">
									Tất cả sản phẩm
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-white transition">
									Khuyến mãi
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-white transition">
									Sản phẩm mới
								</Link>
							</li>
						</ul>
					</div>

					{/* Cột Tài khoản */}
					<div>
						<h4 className="font-semibold text-white mb-4">Tài khoản</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link to="/profile" className="hover:text-white transition">
									Tài khoản của tôi
								</Link>
							</li>
							<li>
								<Link to="/orders" className="hover:text-white transition">
									Lịch sử đơn hàng
								</Link>
							</li>
							<li>
								<Link to="/cart" className="hover:text-white transition">
									Giỏ hàng
								</Link>
							</li>
						</ul>
					</div>

					{/* Cột Hỗ trợ */}
					<div>
						<h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link to="#" className="hover:text-white transition">
									Trung tâm trợ giúp
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-white transition">
									Chính sách bảo mật
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-white transition">
									Điều khoản dịch vụ
								</Link>
							</li>
						</ul>
					</div>

					{/* Cột Liên hệ */}
					<div>
						<h4 className="font-semibold text-white mb-4">Liên hệ</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<p>Email: nhanphu1609@gmail.com</p>
							</li>
							<li>
								<p>Hotline: 0392324050</p>
							</li>
							<li>
								<p>
									Địa chỉ: P. Nguyễn Trác, Yên Nghĩa, Hà Đông, Hà Nội, Việt Nam
								</p>
							</li>
						</ul>
					</div>
				</div>

				{/* Phần dưới: Copyright */}
				<div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm">
					<p>© {new Date().getFullYear()} PKA BTL. Đã đăng ký bản quyền.</p>
					<p>Thiết kế & Phát triển bởi Nhóm PKA</p>
				</div>
			</div>
		</footer>
	);
}
