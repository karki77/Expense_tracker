import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '#utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import ExcelfileUploadService from './service';

export class FileUploadController {
  private ExcelfileUploadService = ExcelfileUploadService;
  /**
   * Upload excel file
   */
  public async uploadExcelFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Check if file exists in request
      if (!req.file) {
        throw new HttpException(400, 'No file uploaded');
      }

      console.log('Uploaded file:', req.file);

      // Just use the filename
      const filename = req.file.filename;

      // Update user profile with just the filename
      await this.ExcelfileUploadService.uploadExcelFile(filename);

      res.send(
        new HttpResponse({
          message: 'file uploaded successfully',
          data: { filename },
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new FileUploadController();
