import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

export const handleChat = async (req, res) => {
	try {
		const { message } = req.body;

		// 1. Lấy dữ liệu sản phẩm (Giữ nguyên logic cũ)
		const products = await Product.find({})
			.select("title price description stock")
			.limit(30);

		const productContext = products
			.map((p) => `- ${p.title} (${p.price.toLocaleString("vi-VN")}đ): ${(p.description || "").substring(0, 100)}...`)
			.join("\n");

		// 2. Prompt (Giữ nguyên)
		const systemPrompt = `
        Bạn là nhân viên tư vấn của PkaShop. Dữ liệu sản phẩm:
        ${productContext}
        
        Khách hỏi: "${message}"
        Trả lời ngắn gọn, thân thiện, bán hàng khéo léo.
        `;

		// 3. GỌI TRỰC TIẾP API CỦA GOOGLE (Không dùng thư viện SDK nữa)
		const apiKey = process.env.GEMINI_API_KEY;
		const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

		const response = await fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{
					parts: [{ text: systemPrompt }]
				}]
			})
		});

		// Xử lý lỗi từ Google trả về
		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(`Gemini API Error: ${errorData}`);
		}

		const data = await response.json();

		// Lấy câu trả lời từ JSON phức tạp của Google
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, mình chưa hiểu ý bạn.";

		res.json({ reply: text });

	} catch (error) {
		console.error("Chatbot Error:", error.message);
		res.status(500).json({ reply: "Hệ thống đang bận, bạn thử lại sau chút nhé! 🤖" });
	}
};