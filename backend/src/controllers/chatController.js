import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChat = async (req, res) => {
	try {
		const { message } = req.body;

		// 1. Lấy danh sách sản phẩm từ DB (Chỉ lấy tên, giá và mô tả ngắn để tiết kiệm Token)
		// Giới hạn 30 sản phẩm mới nhất để tránh quá tải context
		const products = await Product.find({})
			.select("title price description stock")
			.limit(30);

		// 2. Tạo đoạn văn bản chứa dữ liệu sản phẩm (Context)
		const productContext = products
			.map(
				(p) =>
					`- Tên: ${p.title} | Giá: ${p.price.toLocaleString("vi-VN")}đ | Tồn kho: ${p.stock} | Mô tả: ${p.description.substring(0, 100)}...`
			)
			.join("\n");

		// 3. Thiết lập vai trò cho AI (Prompt Engineering)
		const systemPrompt = `
      Bạn là nhân viên tư vấn bán hàng nhiệt tình của cửa hàng "PkaShop".
      Dưới đây là danh sách sản phẩm hiện có của cửa hàng:
      ${productContext}

      Quy tắc trả lời:
      1. Chỉ trả lời dựa trên danh sách sản phẩm ở trên.
      2. Nếu khách hỏi sản phẩm không có trong danh sách, hãy gợi ý sản phẩm tương tự hoặc nói khéo là hết hàng.
      3. Trả lời ngắn gọn, thân thiện, dùng emoji, xưng hô là "mình" và "bạn".
      4. Luôn khuyến khích khách thêm vào giỏ hàng.
      
      Câu hỏi của khách: "${message}"
    `;

		// 4. Gọi Gemini API
		const model = genAI.getGenerativeModel({ model: "gemini-pro" });
		const result = await model.generateContent(systemPrompt);
		const response = await result.response;
		const text = response.text();

		res.json({ reply: text });
	} catch (error) {
		console.error("Chatbot Error:", error);
		res.status(500).json({ reply: "Xin lỗi, hệ thống đang bận. Bạn chờ chút nhé! 🤖" });
	}
};