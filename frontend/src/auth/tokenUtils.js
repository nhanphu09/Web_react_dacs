export const saveUser = (userData) => {
	localStorage.setItem("user", JSON.stringify(userData));
};

// 🔹 Lấy user ra từ localStorage
export const getStoredUser = () => {
	const data = localStorage.getItem("user");
	try {
		return data ? JSON.parse(data) : null;
	} catch {
		return null;
	}
};

// 🔹 Xoá user khỏi localStorage
export const clearStoredUser = () => {
	localStorage.removeItem("user");
};

// 🔹 Lấy token nhanh (nếu cần)
export const getToken = () => {
	const user = getStoredUser();
	return user?.token || null;
};
