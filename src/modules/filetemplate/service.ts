import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { Request, Response } from 'express';
import { TemplateConfig } from './interface';
import * as csvParser from 'csv-parse/sync';
import HttpException from '../../utils/api/httpException';
import path from 'path';
import fs from 'fs';
import { ParsedRow } from './interface';

export class FileTemplateService {
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
    const courseBatches = {
      NodeJS: ['morning', 'evening'],
      JavaScript: ['B1', 'B2', 'B3'],
    };

    const courses = Object.keys(courseBatches);

    // Fill course list in column A
    courses.forEach((course, i) => {
      validationSheet.getCell(i + 1, 1).value = course;
    });

    // Fill NodeJS batches in column B
    courseBatches.NodeJS.forEach((batch, i) => {
      validationSheet.getCell(i + 1, 2).value = batch;
    });

    // Fill JavaScript batches in column C
    courseBatches.JavaScript.forEach((batch, i) => {
      validationSheet.getCell(i + 1, 3).value = batch;
    });

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
      worksheet.getCell(`I${rowIndex}`).dataValidation = {
        type: 'list',
        formulae: [
          `OFFSET(ValidationData!$B$1,0,IF(H${rowIndex}="NodeJS",0,IF(H${rowIndex}="JavaScript",1,0)),IF(H${rowIndex}="NodeJS",${courseBatches.NodeJS.length},IF(H${rowIndex}="JavaScript",${courseBatches.JavaScript.length},1)),1)`,
        ],
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
}

export default new FileTemplateService();
