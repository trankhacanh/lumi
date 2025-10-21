import multer from 'multer';
import path from 'path';
import fs from 'fs';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public"); // Thư mục lưu trữ tạm thời
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

export const upload = multer({ storage: storage });