import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthProvider";

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProducts(data);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            // toast.error("Failed to load wishlist");
        }
        setLoading(false);
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Removed from wishlist");
            setProducts(products.filter((p) => p._id !== productId));
        } catch (error) {
            toast.error("Failed to remove product");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="relative group">
                            <ProductCard product={product} />
                            <button
                                onClick={() => handleRemoveFromWishlist(product._id)}
                                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors z-10"
                                title="Remove from wishlist">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
