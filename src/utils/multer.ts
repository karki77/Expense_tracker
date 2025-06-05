import multer from 'multer';
import fs from 'fs';
import path from 'path';
import HttpException from './api/httpException';
const uploadDir = path.resolve(process.cwd(), 'uploads');
// Ensure uploads directory exists

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory: ${uploadDir}`);
  } else {
    console.log(`Upload directory already exists: ${uploadDir}`);
  }
} catch (error) {
  console.error(
    `Error creating upload directory: ${error instanceof Error ? error.message : String(error)}`,
  );
  throw new Error('Failed to create upload directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + '-' + file.originalname);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Accept images, documents, and other common file types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    throw new HttpException(415, 'Unsupported media type!');
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
