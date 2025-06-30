import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import * as csvParser from 'csv-parse/sync';
import HttpException from '../../utils/api/httpException';

interface ParsedRow {
  [key: string]: string;
}
class FileUploadService {
  async parseFile(filename: string): Promise<ParsedRow[]> {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new HttpException(404, 'Uploaded file not found');
    }

    const ext = path.extname(filename).toLowerCase();

    try {
      if (ext === '.csv') {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return csvParser.parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
      } else if (ext === '.xlsx' || ext === '.xls') {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet, { defval: '' }) as ParsedRow[];
      } else {
        throw new HttpException(400, 'Unsupported file type');
      }
    } catch (error) {
      throw new HttpException(500, 'Failed to parse file');
    }
  }
}

export default new FileUploadService();
