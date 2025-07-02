import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '#utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import FileService from './service';

export class FileController {
  private FileService = FileService;
  /**
   * Upload excel file
   */
  async processUploadedFile(
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
      console.log('Parsed & validated data:', req.body);

      // Update user profile with just the filename
      await this.FileService.parseFile(req.file.filename);

      res.send(
        new HttpResponse({
          message: 'file uploaded successfully',
          data: { filename: req.file.filename, parsedData: req.body },
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /*
   * get the file infos without downloading
   */
  async getFileInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { filename } = req.params;
      if (!filename) {
        throw new HttpException(400, 'Filename parameter is required');
      }
      const fileInfo = await this.FileService.getFileInfo(filename);
      res.send(
        new HttpResponse({
          message: 'File information retreived successfully',
          data: { ...fileInfo },
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /*
   * stream download the file
   */
  async streamFileDownload(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { filename } = req.params;
      if (!filename) {
        throw new HttpException(400, 'Filename parameter is required');
      }
      await this.FileService.streamFileDownload(filename, res);
      res.send(
        new HttpResponse({
          message: 'file downloaded successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new FileController();
