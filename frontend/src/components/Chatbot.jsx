import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../api/client";

export default function Chatbot() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			text: "Xin chào! Tôi là trợ lý AI của PKA Shop. Tôi có thể giúp gì cho bạn?",
			sender: "bot",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	// Tự động cuộn xuống tin nhắn mới nhất
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isOpen]);

	const handleSend = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage = input;
		setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
		setInput("");
		setLoading(true);

		try {
			// Gọi API Chat ở backend
			const res = await api.post("/chat", { message: userMessage });

			// 🟢 LOG DEBUG: In phản hồi từ server ra console
			console.log("✅ Server response received:", res.data);

			// Đảm bảo không xử lý tin nhắn trống
			if (res.data?.reply) {
				setMessages((prev) => [
					...prev,
					{ text: res.data.reply, sender: "bot" },
				]);
			} else {
				setMessages((prev) => [
					...prev,
					{ text: "AI không thể trả lời câu hỏi này.", sender: "bot" },
				]);
			}
		} catch (error) {
			console.error("❌ Frontend Chat Error:", error);
			setMessages((prev) => [
				...prev,
				{ text: "Xin lỗi, tôi đang gặp sự cố kết nối.", sender: "bot" },
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			{/* Cửa sổ Chat */}
			{isOpen && (
				<div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
					{/* Header */}
					<div className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
							<h3 className="font-bold">PKA Shop AI Support</h3>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className="hover:bg-red-500/20 p-1 rounded">
							<X size={20} />
						</button>
					</div>

					{/* Body Messages */}
					<div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex ${
									msg.sender === "user" ? "justify-end" : "justify-start"
								}`}>
								<div
									className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
										msg.sender === "user"
											? "bg-primary text-white rounded-tr-none"
											: "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
									}`}>
									{msg.text}
								</div>
							</div>
						))}
						{loading && (
							<div className="flex justify-start">
								<div className="bg-gray-200 text-gray-500 p-3 rounded-2xl rounded-tl-none text-xs italic animate-pulse">
									AI đang suy nghĩ...
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input Footer */}
					<form
						onSubmit={handleSend}
						className="p-3 bg-white border-t border-gray-200 flex gap-2">
						<input
							type="text"
							placeholder="Hỏi về sản phẩm..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						<button
							type="submit"
							disabled={loading}
							className="bg-primary text-white p-2 rounded-full hover:bg-secondary transition disabled:opacity-50">
							<Send size={18} />
						</button>
					</form>
				</div>
			)}

			{/* Nút Bật/Tắt (Bubble) */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-secondary transition-transform transform hover:scale-110 active:scale-90">
				{isOpen ? <X size={28} /> : <MessageCircle size={28} />}
			</button>
		</div>
	);
}
