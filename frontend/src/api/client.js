import axios from "axios";

const client = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
	headers: { "Content-Type": "application/json" },
	// withCredentials: true, // bật nếu bạn dùng httpOnly cookie
});

client.interceptors.request.use((config) => {
	try {
		const user = JSON.parse(localStorage.getItem("user") || "null");
		if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
	} catch (e) {}
	return config;
});

export default client;
