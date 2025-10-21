import { createContext, useContext, useState } from "react";
import client from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [loading, setLoading] = useState(false);

	const login = async (email, password) => {
		setLoading(true);
		try {
			const res = await client.post("/auth/login", { email, password });
			const { token, user } = res.data;

			// Đảm bảo role có mặt ở cấp cao nhất
			const userData = { ...user, token };

			setUser(userData);
			localStorage.setItem("user", JSON.stringify(userData));

			return userData;
		} catch (err) {
			console.error("Login failed:", err.response?.data || err.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const register = async (name, email, password) => {
		setLoading(true);
		try {
			const res = await client.post("/auth/register", {
				name,
				email,
				password,
			});
			return res.data;
		} catch (err) {
			console.error("Register failed:", err.response?.data || err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	const updateProfile = async (data) => {
		try {
			const res = await client.put("/users/profile", data, {
				headers: { Authorization: `Bearer ${user?.token}` },
			});
			setUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
		} catch (err) {
			console.error("Profile update failed:", err);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, login, register, logout, updateProfile }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
