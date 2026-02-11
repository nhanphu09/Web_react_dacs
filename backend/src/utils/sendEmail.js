import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Thêm thời gian chờ để mạng lag vẫn gửi được
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
    });

    const mailOptions = {
        from: `"PkaShop Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export const sendOrderEmail = async (email, order) => {
    const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + "đ";

    // 🔥 SỬA LỖI Ở ĐÂY: Chuyển _id thành String trước khi slice
    const orderId = order._id.toString().slice(-6).toUpperCase();

    const productListHtml = order.products
        .map(
            (item) => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${item.product?.title || "Sản phẩm"}</td>
            <td style="padding: 10px; text-align: center;">x${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">${formatCurrency(item.product?.price * item.quantity)}</td>
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
                    <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${orderId}</p>
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
            subject: `[PkaShop] Xác nhận đơn hàng #${orderId}`, // Dùng biến orderId đã xử lý
            message: message,
        });
        // Không log ở đây nữa vì bên Controller đã log rồi
    } catch (error) {
        throw error; // Ném lỗi ra để Controller bắt được
    }
};

export default sendEmail;