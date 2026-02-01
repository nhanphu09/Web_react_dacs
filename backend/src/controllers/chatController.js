import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

export const handleChat = async (req, res) => {
	try {
		const { message } = req.body;

		// 1. Lấy dữ liệu sản phẩm
		const products = await Product.find({})
			.select("title price description stock")
			.limit(30);

		const productContext = products
			.map((p) => `- ${p.title} (${p.price.toLocaleString("vi-VN")}đ): ${(p.description || "").substring(0, 100)}...`)
			.join("\n");

		// 2. Prompt
		const systemPrompt = `
        Bạn là nhân viên tư vấn của PkaShop. Dữ liệu sản phẩm:
        ${productContext}
        
        Khách hỏi: "${message}"
        Trả lời ngắn gọn, thân thiện, bán hàng khéo léo.
        `;

		// 3. GỌI API (SỬA LẠI URL NÀY)
		const apiKey = process.env.GEMINI_API_KEY;

		// 👇 THAY ĐỔI Ở ĐÂY: Chuyển về 'gemini-pro' (Model quốc dân, chắc chắn chạy)
		const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

		const response = await fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{
					parts: [{ text: systemPrompt }]
				}]
			})
		});

		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(`Gemini API Error: ${errorData}`);
		}

		const data = await response.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, mình chưa hiểu ý bạn.";

		res.json({ reply: text });

	} catch (error) {
		console.error("Chatbot Error:", error.message);
		res.status(500).json({ reply: "Hệ thống đang bận, bạn thử lại sau chút nhé! 🤖" });
	}
};