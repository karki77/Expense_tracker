import ExcelJS from 'exceljs';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';
import csvParser from 'csv-parse/sync';
import HttpException from '../../utils/api/httpException';
import { ParsedRow } from './interface';

class FileTemplateService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');
  async generateAndDownloadTemplate(
    req: Request,
    res: Response,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User Template');

    // Define headers
    const headers = [
      'Full Name',
      'Username',
      'Email',
      'Contact',
      'Address',
      'Gender',
      'Dob',
      'Course Name',
      'Batch',
    ];
    worksheet.columns = headers.map((header) => ({
      header,
      width: 25,
      key: header.toLowerCase().replace(/\s+/g, '_'),
    }));

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.protection = { locked: true };
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFE599' },
      };
    });

    worksheet.properties.defaultRowHeight = 25;

    // Create hidden sheet for validation data
    const validationSheet = workbook.addWorksheet('ValidationData');
    validationSheet.state = 'hidden';

    // Updated course batches mapping
    // @ts-expect-error
    const fetchCourses = []; // TODO: Replace with actual fetch logic
    const courseBatches: Record<string, string[]> = {};
    //@ts-expect-error
    for (const course of fetchCourses) {
      //@ts-expect-error
      const batchTitles = course.batches.map((batch) => batch.title);
      if (batchTitles.length > 0) {
        courseBatches[course.title] = batchTitles;
      }
    }
    const courses = Object.keys(courseBatches);
    fillValidationData(validationSheet, courseBatches);

    // Unlock all input cells
    for (let rowIndex = 2; rowIndex <= 600; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      for (let colIndex = 1; colIndex <= headers.length; colIndex++) {
        row.getCell(colIndex).protection = { locked: false };
      }
    }

    // Add validations
    for (let rowIndex = 2; rowIndex <= 600; rowIndex++) {
      // Gender dropdown (F)
      worksheet.getCell(`F${rowIndex}`).dataValidation = {
        type: 'list',
        formulae: ['"Male,Female,Other"'],
        allowBlank: true,
        showErrorMessage: true,
        errorTitle: 'Invalid Gender',
        error: 'Choose Male, Female or Other',
      };

      // DOB validation (G)
      worksheet.getCell(`G${rowIndex}`).dataValidation = {
        type: 'date',
        operator: 'lessThanOrEqual',
        formulae: [new Date().toISOString().split('T')[0]],
        showErrorMessage: true,
        errorTitle: 'Invalid Date',
        error: 'Date must not be in the future.',
      };
      worksheet.getCell(`G${rowIndex}`).numFmt = 'yyyy/mm/dd';

      // Course dropdown (H)
      worksheet.getCell(`H${rowIndex}`).dataValidation = {
        type: 'list',
        formulae: [`ValidationData!$A$1:$A$${courses.length}`],
        allowBlank: true,
        showErrorMessage: true,
        errorTitle: 'Invalid Course',
        error: 'Choose from the course list',
      };

      // Dynamic Batch dropdown (I) using OFFSET function
      // This creates a conditional dropdown based on the course selection
      const formula = generateOffsetFormula(courseBatches, rowIndex);
      worksheet.getCell(`I${rowIndex}`).dataValidation = {
        type: 'list',
        formulae: [formula],
        allowBlank: true,
        showErrorMessage: true,
        errorTitle: 'Invalid Batch',
        error:
          'Please select a course first, then choose from the available batches',
      };
    }

    // Protect the worksheet
    await worksheet.protect('your-secure-password', {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      deleteColumns: false,
    });

    // Send Excel file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="user_template.xlsx"',
    );
    await workbook.xlsx.write(res);
    res.end();
  }
  /**
   * Parse uploaded file and return parsed rows
   */
  async parseFile(buffer: Buffer, filename: string): Promise<ParsedRow[]> {
    if (!buffer || buffer.length === 0) {
      throw new HttpException(400, 'File buffer is empty or invalid');
    }

    const ext = path.extname(filename).toLowerCase();

    try {
      if (ext === '.csv') {
        // Convert buffer to string for CSV parsing
        const fileContent = buffer.toString('utf-8');
        return csvParser.parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
      } else if (ext === '.xlsx' || ext === '.xls') {
        // Parse Excel file directly from buffer
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        console.log('Workbook sheet names:', workbook.SheetNames);

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        console.log('Sheet data:', sheet);

        const parsed = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: false,
        });
        console.log('Parsed output:', parsed);
        return parsed as ParsedRow[];
      } else {
        throw new HttpException(400, 'Unsupported file type');
      }
    } catch (error) {
      console.error('File parsing error:', error);
      throw new HttpException(500, 'Failed to parse file');
    }
  }
}

/**
 * Fill validation data
 */
function fillValidationData(
  sheet: ExcelJS.Worksheet,
  courseBatches: Record<string, string[]>,
) {
  const courses = Object.keys(courseBatches);

  // Fill course names in column A
  courses.forEach((course, rowIndex) => {
    sheet.getCell(rowIndex + 1, 1).value = course;
  });

  // Fill each course's batches in columns B, C, D, etc.
  courses.forEach((course, colIndex) => {
    const batches = courseBatches[course];
    batches.forEach((batch, rowIndex) => {
      // +2 because batches start from column B (2nd column)
      sheet.getCell(rowIndex + 1, colIndex + 2).value = batch;
    });
  });
}

/**
 * Generate offset formula for batch based on course
 */
function generateOffsetFormula(
  courseBatches: Record<string, string[]>,
  rowIndex: number,
): string {
  const courseNames = Object.keys(courseBatches);

  const colOffsetFormula = courseNames
    .map((course, idx) => `IF(H${rowIndex}="${course}",${idx}`)
    .join(',');
  const colOffset = `${colOffsetFormula}${')'.repeat(courseNames.length)}`;

  const heightFormula = courseNames
    .map(
      (course) => `IF(H${rowIndex}="${course}",${courseBatches[course].length}`,
    )
    .join(',');
  const height = `${heightFormula}${')'.repeat(courseNames.length)}`;

  return `OFFSET(ValidationData!$B$1,0,${colOffset},${height},1)`;
}

export default new FileTemplateService();
