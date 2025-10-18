import React from "react";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
			<div className="text-center max-w-2xl bg-white shadow-lg rounded-2xl p-10">
				<h1 className="text-4xl font-extrabold text-primary mb-4">
					Welcome to WepShop 🛒
				</h1>

				<p className="text-gray-600 text-lg mb-3">
					Discover our products, add your favorites to the cart, and place your
					orders easily.
				</p>

				<p className="text-gray-600 text-lg mb-6">
					Go to the <span className="font-semibold text-primary">Products</span>{" "}
					page to search and filter your favorite items.
				</p>

				<a
					href="/products"
					className="inline-block bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-secondary transition-all duration-300">
					Shop Now
				</a>
			</div>
		</div>
	);
}
