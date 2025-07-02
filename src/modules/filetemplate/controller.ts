import { Request, Response, NextFunction } from 'express';
import FileTemplateService from './service';
import { HttpResponse } from '../../utils/api/httpResponse';
class FileTemplateController {
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
}

export default new FileTemplateController();
