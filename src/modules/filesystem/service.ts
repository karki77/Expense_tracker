import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import * as csvParser from 'csv-parse/sync';
import { Response } from 'express';
import HttpException from '../../utils/api/httpException';
import { ParsedRow, FileInfo } from './interfaces';

class FileService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');

  async parseFile(filename: string): Promise<ParsedRow[]> {
    const filePath = path.join(this.uploadDir, filename);

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
  /**
   * Get file information without downloading
   */
  async getFileInfo(filename: string): Promise<FileInfo> {
    const filePath = path.join(this.uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new HttpException(404, 'File not found');
    }

    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    return {
      filename,
      size: stats.size,
      mimeType: this.getMimeType(ext),
      lastModified: stats.mtime,
    };
  }

  /**
   * Stream file download to response
   */
  async streamFileDownload(filename: string, res: Response): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new HttpException(404, 'File not found');
    }

    try {
      const stats = fs.statSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      const mimeType = this.getMimeType(ext);

      // Set headers
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', stats.size);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.setHeader('Last-Modified', stats.mtime.toUTCString());

      // Create read stream and pipe to response
      const readStream = fs.createReadStream(filePath);

      readStream.on('error', (error) => {
        throw new HttpException(500, 'Failed to read file');
      });

      readStream.pipe(res);
    } catch (error) {
      throw new HttpException(500, 'Failed to stream file');
    }
  }

  /**
   * Get MIME type based on file extension
   */
  private getMimeType(ext: string): string {
    const mimeTypes: { [key: string]: string } = {
      // Documents
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.rtf': 'application/rtf',

      // Data files
      '.csv': 'text/csv',
      '.json': 'application/json',
      '.xml': 'application/xml',

      // Images
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',

      // Audio
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',

      // Video
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.wmv': 'video/x-ms-wmv',
      '.flv': 'video/x-flv',

      // Archives
      '.zip': 'application/zip',
      '.rar': 'application/vnd.rar',
      '.7z': 'application/x-7z-compressed',
      '.tar': 'application/x-tar',
      '.gz': 'application/gzip',

      // Other
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}

export default new FileService();
