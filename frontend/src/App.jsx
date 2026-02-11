import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar";
import PromoBar from "./components/PromoBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Lazy load components
const AdminLayout = React.lazy(() => import("./components/AdminLayout.jsx"));
const AdminCategories = React.lazy(() => import("./pages/AdminCategories"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const AdminOrders = React.lazy(() => import("./pages/AdminOrders"));
const AdminProducts = React.lazy(() => import("./pages/AdminProducts"));
const AdminReports = React.lazy(() => import("./pages/AdminReports"));
const AdminUsers = React.lazy(() => import("./pages/AdminUsers"));
const AdminCoupons = React.lazy(() => import("./pages/AdminCoupons"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Orders = React.lazy(() => import("./pages/Orders"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Products = React.lazy(() => import("./pages/Products"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Register = React.lazy(() => import("./pages/Register"));
const Review = React.lazy(() => import("./pages/Review"));
const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));

export default function App() {
	return (
		<>
			<Navbar />
			<PromoBar />
			<Suspense fallback={<LoadingSpinner />}>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route
						path="/password/reset/:token"
						element={<ResetPassword />}
					/>
					<Route path="/products" element={<Products />} />
					<Route path="/product/:id" element={<ProductDetail />} />

					{/* --- Protected for logged users (Khách hàng) --- */}
					<Route
						path="/wishlist"
						element={
							<ProtectedRoute>
								<Wishlist />
							</ProtectedRoute>
						}
					/>
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
			</Suspense>
			<Chatbot />
			<Footer />
		</>
	);
}