import { Router } from 'express';
import upload from '../../utils/multer';
import FileUploadController from './controller';
const fileRouter = Router();

fileRouter.get('/', (req, res) => {
  console.log('----------------------');
  res.send('ok');
});

fileRouter.post(
  '/upload-excel-file',
  upload.single('file'),
  FileUploadController.uploadExcelFile.bind(FileUploadController),
);

export default fileRouter;
