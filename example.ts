import HttpException from '#utils/api/httpException';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

interface MediaRequestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface ProcessedExcelData {
  headers: string[];
  data: any[];
  filename: string;
  originalName: string;
  totalRows: number;
  parsedForMedia: MediaRequestData[];
}

class ExcelFileUploadService {
  /**
   * Complete Excel/CSV file processing service
   * 1. Upload file (handled by multer)
   * 2. Read file content
   * 3. Parse content
   * 4. Prepare data for MediaRequest middleware
   */
  async processUploadedFile(
    file: Express.Multer.File,
  ): Promise<ProcessedExcelData> {
    try {
      if (!file) {
        throw new HttpException(400, 'No file uploaded');
      }

      // Read and parse file content
      const rawData = await this.readFileContent(file.filename);

      // Process headers
      const rawHeaders = rawData[0] || [];
      const headers = this.processHeaders(rawHeaders);

      if (headers.length === 0) {
        throw new HttpException(400, 'File must contain valid headers');
      }

      // Process data rows
      const processedRows: any[] = [];
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || this.isEmptyRow(row)) continue;

        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] ? String(row[index]).trim() : '';
        });

        // Only add row if it has meaningful data
        if (Object.values(rowData).some((value) => value !== '')) {
          processedRows.push(rowData);
        }
      }

      // Prepare data for MediaRequest middleware
      const parsedForMedia = this.prepareForMediaRequest(processedRows);

      return {
        headers,
        data: processedRows,
        filename: file.filename,
        originalName: file.originalname,
        totalRows: processedRows.length,
        parsedForMedia,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Error processing uploaded file');
    }
  }

  /**
   * Read file content (Excel or CSV)
   */
  private async readFileContent(filename: string): Promise<any[][]> {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new HttpException(404, 'Uploaded file not found');
    }

    const fileExtension = path.extname(filename).toLowerCase();
    let rawData: any[][];

    if (fileExtension === '.csv') {
      // Handle CSV files
      rawData = this.parseCSVFile(filePath);
    } else {
      // Handle Excel files
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        blankrows: false,
      });
    }

    if (!rawData || rawData.length === 0) {
      throw new HttpException(400, 'File is empty');
    }

    return rawData;
  }

  /**
   * Parse CSV file content
   */
  private parseCSVFile(filePath: string): any[][] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    return lines.map((line) => {
      return line.split(',').map((cell) => cell.trim());
    });
  }

  /**
   * Prepare data for MediaRequest middleware
   * Maps parsed data to required format: firstName, lastName, email, phone, address
   */
  private prepareForMediaRequest(data: any[]): MediaRequestData[] {
    return data.map((row, index) => {
      try {
        return {
          firstName:
            this.getFieldValue(row, ['firstname', 'first_name', 'fname']) || '',
          lastName:
            this.getFieldValue(row, ['lastname', 'last_name', 'lname']) || '',
          email:
            this.getFieldValue(row, ['email', 'email_address', 'mail']) || '',
          phone:
            this.getFieldValue(row, [
              'phone',
              'phone_number',
              'mobile',
              'contact',
            ]) || '',
          address:
            this.getFieldValue(row, ['address', 'location', 'addr']) || '',
        };
      } catch (error) {
        throw new HttpException(400, `Invalid data in row ${index + 1}`);
      }
    });
  }

  /**
   * Get field value by trying multiple possible field names
   */
  private getFieldValue(row: any, possibleNames: string[]): string {
    for (const name of possibleNames) {
      if (row[name] && String(row[name]).trim() !== '') {
        return String(row[name]).trim();
      }
    }
    return '';
  }

  /**
   * Process and clean header names
   */
  private processHeaders(rawHeaders: any[]): string[] {
    return rawHeaders.map((header, index) => {
      if (!header || header.toString().trim() === '') {
        return `column_${index + 1}`;
      }
      return header
        .toString()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^\w\s-]/g, '')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '')
        .toLowerCase();
    });
  }

  /**
   * Check if a row is completely empty
   */
  private isEmptyRow(row: any[]): boolean {
    return row.every(
      (cell) =>
        cell === null || cell === undefined || cell.toString().trim() === '',
    );
  }
}

export default new ExcelFileUploadService();
