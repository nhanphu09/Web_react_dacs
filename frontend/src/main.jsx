import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // 🟢 THÊM
import "react-toastify/dist/ReactToastify.css"; // 🟢 THÊM
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<AuthProvider>
			<App />
			<ToastContainer autoClose={3000} /> {/* 🟢 THÊM */}
		</AuthProvider>
	</BrowserRouter>
);
