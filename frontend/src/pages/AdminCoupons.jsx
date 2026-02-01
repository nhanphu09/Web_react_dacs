import { Tag, Trash2, Plus, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [newCode, setNewCode] = useState("");
    const [discount, setDiscount] = useState(10);
    const [expiry, setExpiry] = useState("");

    // Tải danh sách
    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await api.get("/coupons");
            setCoupons(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Tạo mã mới
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCode || !expiry) return toast.warn("Vui lòng nhập đủ thông tin!");

        try {
            const res = await api.post("/coupons", {
                code: newCode,
                discount: Number(discount),
                expirationDate: expiry,
            });
            setCoupons([res.data, ...coupons]);
            setNewCode("");
            setDiscount(10);
            setExpiry("");
            toast.success("Tạo mã thành công!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi tạo mã");
        }
    };

    // Xóa mã
    const handleDelete = async (id) => {
        if (!window.confirm("Xóa mã này?")) return;
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(coupons.filter((c) => c._id !== id));
            toast.success("Đã xóa!");
        } catch (err) {
            toast.error("Lỗi xóa mã");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Tag className="text-primary" /> Quản lý Mã giảm giá
            </h2>

            {/* Form tạo mã */}
            <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Plus size={20} /> Tạo mã mới
                </h3>
                <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Mã (VD: SALE50)"
                        className="border p-2 rounded flex-1 uppercase"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    />
                    <div className="flex items-center gap-2 border p-2 rounded w-32">
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            className="w-full outline-none"
                        />
                        <span>%</span>
                    </div>
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                    />
                    <button className="bg-primary text-white px-6 py-2 rounded hover:bg-red-700 font-bold">
                        Thêm
                    </button>
                </form>
            </div>

            {/* Danh sách mã */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4">Mã Code</th>
                            <th className="p-4">Giảm giá</th>
                            <th className="p-4">Hết hạn</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((c) => (
                            <tr key={c._id} className="border-t hover:bg-gray-50">
                                <td className="p-4 font-bold text-primary">{c.code}</td>
                                <td className="p-4">{c.discount}%</td>
                                <td className="p-4 flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    {new Date(c.expirationDate).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="p-4">
                                    {new Date(c.expirationDate) < new Date() ? (
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Hết hạn</span>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Đang chạy</span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:bg-red-100 p-2 rounded-full">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {coupons.length === 0 && <p className="p-6 text-center text-gray-500">Chưa có mã nào.</p>}
            </div>
        </div>
    );
}