import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Home = lazy(() => import("../pages/user/Home"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));

export default function AppRoutes() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Routes>
				<Route path="/auth/login" element={<Login />} />
				<Route path="/auth/register" element={<Register />} />
				<Route
					path="/admin/*"
					element={
						<ProtectedRoute adminOnly>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/*"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Suspense>
	);
}
