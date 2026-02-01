import { CheckCircle, Copy, CreditCard, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";

export default function PaymentPage() {
    const { id } = useParams(); // Lấy ID đơn hàng từ URL
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- CẤU HÌNH TÀI KHOẢN NHẬN TIỀN CỦA BẠN ---
    const MY_BANK = {
        BANK_ID: "MB", // Tên viết tắt ngân hàng (MB, VCB, ACB, VPB, TPB...)
        ACCOUNT_NO: "0077302516666", // Thay số tài khoản của bạn vào đây
        ACCOUNT_NAME: "NGUYEN VAN PHU", // Tên chủ tài khoản
        TEMPLATE: "compact2" // Giao diện QR (compact, compact2, qr_only, print)
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`); // Cần Backend có API get order by ID
                // Nếu chưa có API này, tạm thời dùng API get all rồi filter (không khuyến khích)
                // Hoặc bạn phải viết thêm route GET /orders/:id ở Backend
                setOrder(data);
            } catch (error) {
                toast.error("Không tìm thấy đơn hàng");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, navigate]);

    if (loading) return <div className="p-10 text-center">Đang tải thông tin thanh toán...</div>;
    if (!order) return null;

    // Tạo link QR VietQR
    // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<CONTENT>
    const content = `THANHTOAN ${order._id.slice(-6).toUpperCase()}`; // Nội dung CK: THANHTOAN + 6 ký tự cuối mã đơn
    const qrUrl = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-${MY_BANK.TEMPLATE}.png?amount=${order.totalPrice}&addInfo=${content}&accountName=${MY_BANK.ACCOUNT_NAME}`;

    const handleConfirm = () => {
        // Ở thực tế, bạn cần Webhook để tự động xác nhận.
        // Ở đây ta giả lập người dùng bấm "Tôi đã thanh toán"
        toast.success("Cảm ơn! Chúng tôi sẽ kiểm tra và giao hàng sớm.");
        navigate("/orders");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* CỘT TRÁI: Thông tin QR */}
                <div className="flex-1 p-8 flex flex-col items-center justify-center bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-900 mb-2">Quét mã để thanh toán</h2>
                    <p className="text-sm text-blue-600 mb-6">Sử dụng App Ngân hàng hoặc MoMo</p>

                    <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-blue-100 mb-6">
                        <img
                            src={qrUrl}
                            alt="Mã QR thanh toán"
                            className="w-64 h-64 object-contain"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                        <CreditCard size={16} />
                        <span>Chờ thanh toán: </span>
                        <span className="font-bold text-blue-600 text-lg">
                            {order.totalPrice.toLocaleString("vi-VN")} đ
                        </span>
                    </div>
                </div>

                {/* CỘT PHẢI: Thông tin chi tiết */}
                <div className="flex-1 p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Đơn hàng #{order._id.slice(-6).toUpperCase()}</h3>
                            <p className="text-sm text-gray-500">Vui lòng chuyển khoản đúng nội dung bên dưới</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="text-xs text-gray-500 uppercase mb-1">Ngân hàng</p>
                            <p className="font-bold text-gray-800">{MY_BANK.BANK_ID} - {MY_BANK.ACCOUNT_NAME}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center group">
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Số tài khoản</p>
                                <p className="font-bold text-gray-800 text-lg">{MY_BANK.ACCOUNT_NO}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(MY_BANK.ACCOUNT_NO);
                                    toast.info("Đã copy số tài khoản!");
                                }}
                                className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition">
                                <Copy size={20} />
                            </button>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-blue-600 uppercase mb-1 font-bold">Nội dung chuyển khoản (Bắt buộc)</p>
                                <p className="font-bold text-blue-800 text-lg">{content}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(content);
                                    toast.info("Đã copy nội dung!");
                                }}
                                className="text-blue-600 hover:bg-blue-200 p-2 rounded-full transition">
                                <Copy size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition shadow-lg">
                            Tôi đã thanh toán
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                            Thanh toán sau (Về trang chủ)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}