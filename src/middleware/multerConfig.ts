import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb ) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + ext); // Set the file name for uploaded files
    }
})

const upload = multer({storage});

export default upload