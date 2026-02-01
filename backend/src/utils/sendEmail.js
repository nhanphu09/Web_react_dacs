import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (options) => {
    // 1. Tạo transporter (Người đưa thư)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2. Cấu hình email
    const mailOptions = {
        from: `"PkaShop Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message, // Dùng HTML để mail đẹp hơn
    };

    // 3. Gửi
    await transporter.sendMail(mailOptions);
};

// Hàm tạo giao diện HTML cho Email xác nhận đơn hàng
export const sendOrderEmail = async (email, order) => {
    const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + "đ";

    const productListHtml = order.products
        .map(
            (item) => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${item.product.title || "Sản phẩm"}</td>
            <td style="padding: 10px; text-align: center;">x${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">${formatCurrency(item.product.price * item.quantity)}</td>
        </tr>
    `
        )
        .join("");

    const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;">Xác Nhận Đơn Hàng</h1>
            </div>
            
            <div style="padding: 20px;">
                <p>Xin chào <strong>${order.shippingAddress.name}</strong>,</p>
                <p>Cảm ơn bạn đã đặt hàng tại PkaShop! Đơn hàng của bạn đang được xử lý.</p>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${order._id.slice(-6).toUpperCase()}</p>
                    <p style="margin: 5px 0;"><strong>Ngày đặt:</strong> ${new Date().toLocaleDateString("vi-VN")}</p>
                    <p style="margin: 5px 0;"><strong>Phương thức:</strong> ${order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản / QR"}</p>
                </div>

                <h3>Chi tiết đơn hàng</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f3f4f6; text-align: left;">
                            <th style="padding: 10px;">Sản phẩm</th>
                            <th style="padding: 10px; text-align: center;">SL</th>
                            <th style="padding: 10px; text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productListHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Tổng cộng:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; color: #4F46E5; font-size: 18px;">
                                ${formatCurrency(order.totalPrice)}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <p style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                    Nếu có thắc mắc, vui lòng trả lời email này hoặc gọi hotline 1900 xxxx.
                </p>
            </div>
        </div>
    `;

    try {
        await sendEmail({
            email: email,
            subject: `[PkaShop] Xác nhận đơn hàng #${order._id.slice(-6).toUpperCase()}`,
            message: message,
        });
        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ Email send failed:", error);
        // Không throw error để tránh làm lỗi luồng đặt hàng chính
    }
};