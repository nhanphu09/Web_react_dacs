import React, { createContext, useContext, useState } from "react";
import client from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const s = localStorage.getItem("user");
		return s ? JSON.parse(s) : null;
	});
	const [loading, setLoading] = useState(false);

	const login = async (email, password) => {
		setLoading(true);
		try {
			const res = await client.post("/auth/login", { email, password });
			// backend trả về { token, user }
			const { token, user: u } = res.data;
			const merged = {
				...(u || res.data.user || res.data),
				token: token || res.data.token,
			};
			setUser(merged);
			localStorage.setItem("user", JSON.stringify(merged));
			return merged;
		} catch (err) {
			console.error(err.response?.data || err.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
