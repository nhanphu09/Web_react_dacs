import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

// Khởi tạo Gemini
const apiKey = process.env.GEMINI_API_KEY
	? process.env.GEMINI_API_KEY.trim()
	: null;

if (!apiKey) {
	console.error("🔴 LỖI CẤU HÌNH: GEMINI_API_KEY không được tìm thấy.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const chatWithAI = async (req, res) => {
	if (!genAI) {
		console.error("🔴 Chatbot Error: genAI object is null.");
		return res.status(500).json({ message: "Lỗi cấu hình AI trên server." });
	}

	try {
		const { message } = req.body;

		const ProductModel = mongoose.model("Product");

		// 1. Lấy dữ liệu sản phẩm từ DB
		const products = await ProductModel.find({})
			.select("title price stock")
			.limit(20);

		// 2. TẠO CONTEXT DẠNG CHUỖI THUẦN (ĐÃ FIX: KHÔNG DÙNG toLocaleString cho AI)
		const productContext = products
			.map(
				(p) =>
					// 🟢 Cung cấp số "sạch" (raw number) cho AI
					`Tên: ${p.title} | Giá: ${p.price} VND | Kho: ${p.stock}`
			)
			.join("\n");

		console.log(
			`✅ MongoDB Read: ${products.length} products found for AI context.`
		);
		console.log(
			`🟢 AI Context Preview: ${JSON.stringify(products.slice(0, 3))}`
		);

		// 3. Cấu hình Prompt
		const prompt = `
        Bạn là nhân viên hỗ trợ khách hàng (Chatbot) của cửa hàng "PKA Shop".
        Hãy trả lời thân thiện, sử dụng tiếng Việt, và luôn đưa ra phản hồi.
        Nếu bạn không tìm thấy sản phẩm, hãy gợi ý các danh mục chung và hotline (0392324050).
        
        THÔNG TIN DỮ LIỆU SẢN PHẨM:
        ${productContext}
        
        DỰA TRÊN THÔNG TIN TRÊN, hãy trả lời câu hỏi sau: "${message}"
    `;

		// 4. Gửi yêu cầu đến Gemini
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

		const result = await model.generateContent(prompt);

		console.log("Gemini raw result:", JSON.stringify(result, null, 2));

		// Lấy text đúng trường
		const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

		// 5. Kiểm tra và xử lý phản hồi rỗng
		if (typeof text !== "string" || text.trim().length === 0) {
			console.error(
				"🔴 AI Response Failure: Gemini returned non-string or empty content."
			);
			return res.json({
				reply:
					"Xin lỗi, tôi gặp sự cố khi tìm kiếm chi tiết sản phẩm. Vui lòng thử hỏi lại.",
			});
		}

		const logText = text.substring(0, 50);
		console.log(`✅ AI Response for "${message}": ${logText}...`);

		res.json({ reply: text });
	} catch (error) {
		console.error("🔴 Chatbot FINAL FATAL ERROR:", error.message);
		res
			.status(500)
			.json({ message: "AI đang bận hoặc gặp lỗi cấu trúc nội bộ." });
	}
};
