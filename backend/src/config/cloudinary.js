import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// 👇 FIX: Import toàn bộ thư viện vào biến `lib`
import * as lib from "multer-storage-cloudinary";

// 👇 FIX: Lấy class CloudinaryStorage một cách an toàn nhất
// Node.js đôi khi giấu nó trong .default, đôi khi để ở ngoài
const CloudinaryStorage = lib.default?.CloudinaryStorage || lib.CloudinaryStorage || lib.default;

dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình kho lưu trữ
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pkashop_products",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage: storage });

export default upload;