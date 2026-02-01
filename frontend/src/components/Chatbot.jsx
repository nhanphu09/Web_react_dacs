import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import api from "../api/client";

export default function Chatbot() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{ text: "Xin chào! Mình là AI của PkaShop. Bạn cần tìm sản phẩm gì nhỉ? 👋", isUser: false }
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	// Tự động cuộn xuống cuối khi có tin nhắn mới
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isOpen]);

	const handleSend = async () => {
		if (!input.trim()) return;

		const userMsg = input;
		setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
		setInput("");
		setLoading(true);

		try {
			const { data } = await api.post("/chat", { message: userMsg });
			setMessages(prev => [...prev, { text: data.reply, isUser: false }]);
		} catch (error) {
			setMessages(prev => [...prev, { text: "Xin lỗi, mình đang bị lag xíu. Thử lại sau nhé!", isUser: false }]);
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
					<div className="bg-primary p-4 flex justify-between items-center text-white">
						<div className="flex items-center gap-2">
							<div className="bg-white/20 p-2 rounded-full">
								<Bot size={20} />
							</div>
							<div>
								<h3 className="font-bold">Trợ lý ảo AI</h3>
								<p className="text-xs text-blue-100 flex items-center gap-1">
									<span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
								</p>
							</div>
						</div>
						<button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
							<X size={20} />
						</button>
					</div>

					{/* Nội dung tin nhắn */}
					<div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
						{messages.map((msg, index) => (
							<div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
								<div className={`flex gap-2 max-w-[80%] ${msg.isUser ? "flex-row-reverse" : "flex-row"}`}>
									<div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isUser ? "bg-gray-200" : "bg-primary/10 text-primary"}`}>
										{msg.isUser ? <User size={16} /> : <Bot size={16} />}
									</div>
									<div className={`p-3 rounded-2xl text-sm ${msg.isUser
										? "bg-primary text-white rounded-tr-none"
										: "bg-white border text-gray-700 rounded-tl-none shadow-sm"
										}`}>
										{msg.text}
									</div>
								</div>
							</div>
						))}
						{loading && (
							<div className="flex justify-start">
								<div className="bg-gray-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
									<span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
									<span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
									<span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Ô nhập liệu */}
					<div className="p-3 border-t bg-white flex gap-2">
						<input
							type="text"
							placeholder="Hỏi về sản phẩm..."
							className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								// Kiểm tra nếu đang gõ tiếng Việt (IME composition) thì KHÔNG gửi
								if (e.nativeEvent.isComposing) return;

								if (e.key === "Enter") {
									e.preventDefault(); // Chặn hành vi xuống dòng mặc định
									handleSend();
								}
							}}
						/>
						<button
							onClick={handleSend}
							disabled={loading || !input.trim()}
							className="bg-primary text-white p-2 rounded-full hover:bg-secondary transition disabled:opacity-50">
							<Send size={20} />
						</button>
					</div>
				</div>
			)}

			{/* Nút mở Chat */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-secondary transition-transform hover:scale-110 active:scale-95 flex items-center justify-center gap-2">
				{isOpen ? <X size={24} /> : <MessageCircle size={28} />}
			</button>
		</div>
	);
}