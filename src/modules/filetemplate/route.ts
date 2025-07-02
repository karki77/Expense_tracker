import { Router } from 'express';
import upload from '../../utils/multer';
import FileTemplateController from './controller';

const fileSystemRouter = Router();

fileSystemRouter.get(
  '/download',
  FileTemplateController.generateAndDownloadTemplate.bind(
    FileTemplateController,
  ),
);
// fileSystemRouter.post('/upload-excel-file', upload.single('file'), mediaRequest, FileTemplateController.processUploadedFile.bind(FileTemplateController));

export default fileSystemRouter;
