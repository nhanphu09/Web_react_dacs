import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:5000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Tự động thêm token vào header nếu có
instance.interceptors.request.use((config) => {
	const user = localStorage.getItem("user");
	if (user) {
		const token = JSON.parse(user).token;
		if (token) config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default instance;
