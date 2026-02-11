import React from "react";

const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
		</div>
	);
};

export default LoadingSpinner;
