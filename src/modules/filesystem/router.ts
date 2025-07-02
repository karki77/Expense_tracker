import { Router } from 'express';
import upload from '../../utils/multer';
import FileController from './controller';
const fileRouter = Router();

// fileRouter.post(
//   '/upload-excel-file',
//   upload.single('file'),
//   mediaRequest,
//   FileController.processUploadedFile.bind(FileController),
// );

fileRouter.get(
  '/get-fileinfo/:filename',
  FileController.getFileInfo.bind(FileController),
);

fileRouter.get(
  '/download/:filename',
  FileController.streamFileDownload.bind(FileController),
);

export default fileRouter;
