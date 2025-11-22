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
				<Route path="/products" element={<Products />} />{" "}
				<Route path="/product/:id" element={<ProductDetail />} />
				{/* Protected for logged users */}
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
				{/* Admin routes */}
				<Route
					path="/admin"
					element={
						<ProtectedRoute adminOnly>
							<AdminLayout /> {/* 1. Render layout cha */}
						</ProtectedRoute>
					}>
					{/* 2. Đây là các trang con sẽ render bên trong <Outlet /> */}

					{/* /admin (index = true nghĩa là trang mặc định) */}
					<Route index element={<AdminDashboard />} />

					{/* /admin/products */}
					<Route path="products" element={<AdminProducts />} />

					{/* /admin/orders */}
					<Route path="orders" element={<AdminOrders />} />

					{/* /admin/users */}
					<Route path="users" element={<AdminUsers />} />

					{/* /admin/reports */}
					<Route path="reports" element={<AdminReports />} />

					{/* /admin/categories */}
					<Route path="categories" element={<AdminCategories />} />
				</Route>
			</Routes>
			<Chatbot />
			<Footer />
		</>
	);
}
