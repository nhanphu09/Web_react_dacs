// frontend/src/api/client.js
import axios from "axios";
import { clearStoredUser, getStoredUser } from "../auth/tokenUtils";

// Cấu hình baseURL tới backend
const client = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// 🟢 Gắn token vào mỗi request
client.interceptors.request.use((config) => {
	const user = getStoredUser();
	if (user?.token) {
		config.headers.Authorization = `Bearer ${user.token}`;
	}
	return config;
});

// 🔴 Xử lý lỗi trả về (401: hết hạn token)
client.interceptors.response.use(
	(response) => response,
	(error) => {
		const isLoginPath = window.location.pathname === "/login";

		if (error.response?.status === 401 && !isLoginPath) {
			clearStoredUser();
			window.location.href = "/login";
		}

		return Promise.reject(error);
	}
);

export default client;
