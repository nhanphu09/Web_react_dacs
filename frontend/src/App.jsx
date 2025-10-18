import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
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
import Products from "./pages/Products"; // ✅ thêm dòng này
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Review from "./pages/Review";

export default function App() {
	return (
		<>
			<Navbar />
			<Routes>
				{/* Public routes */}
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/products" element={<Products />} />{" "}
				{/* ✅ thêm route này */}
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
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/products"
					element={
						<ProtectedRoute adminOnly>
							<AdminProducts />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/orders"
					element={
						<ProtectedRoute adminOnly>
							<AdminOrders />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/users"
					element={
						<ProtectedRoute adminOnly>
							<AdminUsers />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/reports"
					element={
						<ProtectedRoute adminOnly>
							<AdminReports />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/categories"
					element={
						<ProtectedRoute adminOnly>
							<AdminCategories />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</>
	);
}
