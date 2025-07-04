import { Request, Response, NextFunction } from 'express';
import FileTemplateService from './service';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
class FileTemplateController {
  private FileTemplateService = FileTemplateService;
  /**
   * Generate and download user template (generates and downloads in one action)
   */

  async generateAndDownloadTemplate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await FileTemplateService.generateAndDownloadTemplate(req, res);
    } catch (error) {
      next(error);
    }
  }
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

      const parsedData = await FileTemplateService.parseFile(
        req.file.buffer,
        req.file.originalname,
      );

      res.send(
        new HttpResponse({
          message: 'File uploaded successfully',
          data: {
            filename: req.file.originalname, // Use originalname instead of filename
            data: parsedData,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new FileTemplateController();
