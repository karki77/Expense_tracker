import { prisma } from '../../config/setup/dbSetup';
import HttpException from '#utils/api/httpException';

class ExcelfileUploadService {
  async uploadExcelFile(filename: string) {
    return filename;
  }
}

export default new ExcelfileUploadService();
