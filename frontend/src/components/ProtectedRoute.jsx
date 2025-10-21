import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function ProtectedRoute({ children, adminOnly = false }) {
	const { user } = useAuth();
	if (!user) return <Navigate to="/auth/login" replace />;
	if (adminOnly) {
		const isAdmin = user.isAdmin || user.role === "admin";
		if (!isAdmin) return <Navigate to="/" replace />;
	}
	return children;
}
