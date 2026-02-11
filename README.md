# Web React DACS - Fullstack E-commerce Application

A full-featured E-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Register, Login, Logout, Forgot/Reset Password.
- **Product Management**: View, Search, Filter, Sort Products.
- **Shopping Cart**: Add to cart, adjust quantity, remove items.
- **Checkout Process**: Shipping address, payment method selection.
- **Order Management**: View order history, order details.
- **Wishlist**: Save favorite products (New!).
- **Admin Dashboard**: Manage Products, Orders, Users, Categories, Coupons, Reports.
- **Chatbot**: Integrated AI Chatbot support.
- **Rate Limiting**: API protection against spam.
- **Lazy Loading**: Optimized frontend performance.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Redux/Context API.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Other**: Cloudinary (Image Upload), Nodemailer (Email), JWT (Auth).

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Cloudinary Account
- SMTP Service (Gmail, SendGrid, etc.) for emails

## Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd web_react_dacs
    ```

2.  **Install Dependencies**
    *   **Root (if applicable):** `npm install`
    *   **Backend:**
        ```bash
        cd backend
        npm install
        ```
    *   **Frontend:**
        ```bash
        cd frontend
        npm install
        ```

3.  **Environment Variables**

    Create a `.env` file in the `backend` directory with the following variables:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Email (Nodemailer)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_EMAIL=your_email@gmail.com
    SMTP_PASSWORD=your_app_password
    FROM_EMAIL=your_email@gmail.com
    FROM_NAME=PkaShop

    # Frontend URL (for CORS and Reset Password links)
    FRONTEND_URL=http://localhost:5173
    ```

    Create a `.env` file in the `frontend` directory:

    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

## Running the Application

1.  **Start Backend**
    ```bash
    cd backend
    npm run dev
    ```

2.  **Start Frontend**
    ```bash
    cd frontend
    npm run dev
    ```

    The frontend will run at `http://localhost:5173`.

## API Endpoints (Key)

-   **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/forgotpassword`
-   **Products**: `/api/products`
-   **Users**: `/api/users/profile`, `/api/users/wishlist`
-   **Orders**: `/api/orders`

## Folder Structure

-   `backend/`: Express server, API routes, models, controllers.
-   `frontend/`: React application, components, pages.
