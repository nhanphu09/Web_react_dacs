import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// THÊM KHỐI NÀY VÀO
	server: {
		port: 5173,
	},
});
