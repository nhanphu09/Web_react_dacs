import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout.jsx";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar";
import PromoBar from "./components/PromoBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminCategories from "./pages/AdminCategories";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import AdminCoupons from "./pages/AdminCoupons";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Review from "./pages/Review";
import PaymentPage from "./pages/PaymentPage";

export default function App() {
	return (
		<>
			<Navbar />
			<PromoBar />
			<Routes>
				{/* Public routes */}
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/products" element={<Products />} />
				<Route path="/product/:id" element={<ProductDetail />} />

				{/* --- Protected for logged users (Khách hàng) --- */}
				<Route
					path="/cart"
					element={
						<ProtectedRoute>
							<Cart />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/checkout"
					element={
						<ProtectedRoute>
							<Checkout />
						</ProtectedRoute>
					}
				/>
				{/* 👇 Đặt PaymentPage ở đây mới đúng (Khách hàng truy cập được) */}
				<Route
					path="/payment/:id"
					element={
						<ProtectedRoute>
							<PaymentPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/orders"
					element={
						<ProtectedRoute>
							<Orders />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/review/:id"
					element={
						<ProtectedRoute>
							<Review />
						</ProtectedRoute>
					}
				/>

				{/* --- Admin routes (Chỉ Admin) --- */}
				<Route
					path="/admin"
					element={
						<ProtectedRoute adminOnly>
							<AdminLayout />
						</ProtectedRoute>
					}>
					<Route index element={<AdminDashboard />} />
					<Route path="products" element={<AdminProducts />} />
					<Route path="orders" element={<AdminOrders />} />
					<Route path="users" element={<AdminUsers />} />
					<Route path="reports" element={<AdminReports />} />
					<Route path="categories" element={<AdminCategories />} />
					<Route path="coupons" element={<AdminCoupons />} />
				</Route>
			</Routes>
			<Chatbot />
			<Footer />
		</>
	);
}