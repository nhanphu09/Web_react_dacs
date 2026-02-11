import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgotpassword`,
                { email }
            );
            toast.success(data.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    Forgot Password
                </h2>
                <p className="text-center text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="you@example.com"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
