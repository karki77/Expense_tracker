import { Router } from 'express';
import upload from '../../utils/multer';
import FileUploadController from './controller';
import { mediaRequest } from '../../middleware/mediaRequest';
const fileRouter = Router();

fileRouter.post(
  '/upload-excel-file',
  upload.single('file'),
  mediaRequest,
  FileUploadController.processUploadedFile.bind(FileUploadController),
);

export default fileRouter;
