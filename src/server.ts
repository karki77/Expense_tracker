import path from 'path';
import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';
import express, { static as serveStatic } from 'express';

import envConfig from './config/setup/envConfig';
import { logger, morganLogger } from './utils/logger';
import appRouter from './router';
import globalErrorHandler from './middleware/globalErrorHandler';

const prisma = new PrismaClient();
const PORT = envConfig.server.port ?? 7000;

const app = express();

const projectRoot = path.join(__dirname, '..');
const uploadsPath = path.join(projectRoot, 'uploads');
app.use('/uploads', serveStatic(uploadsPath));

// Morgan HTTP request logging
app.use(morganLogger);

void (async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully.');
  } catch (error) {
    const err = error as Error;
    logger.error(`ERROR CONNECTING DATABASE: ${err.message}`);
    logger.error(err);
    process.exit(1);
  }
})();

app.use(express.json());

// app.get("/template", async (req, res) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('User Template');

//   Define headers
//   const headers = ['Full Name', 'Username', 'Email', 'Contact', 'Address', 'Gender', 'Dob', 'Course Name', 'Batch'];
//   worksheet.columns = headers.map((header) => ({
//     header,
//     width: 25,
//     key: header.toLowerCase().replace(/\s+/g, '_'),
//   }));

//   const headerRow = worksheet.getRow(1);
//   headerRow.eachCell((cell) => {
//     cell.protection = { locked: true };
//     cell.font = { bold: true };
//     cell.fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFFFE599' },
//     };
//   });

//   worksheet.properties.defaultRowHeight = 25;

//   Create hidden sheet for validation data
//   const validationSheet = workbook.addWorksheet('ValidationData');
//   validationSheet.state = 'hidden';

//   Updated course batches mapping
//   const courseBatches = {
//     "NodeJS": ["morning", "evening"],
//     "JavaScript": ["B1", "B2", "B3"],
//   };

//   const courses = Object.keys(courseBatches);

//   Fill course list in column A
//   courses.forEach((course, i) => {
//     validationSheet.getCell(i + 1, 1).value = course;
//   });

//   Dynamically fill batches for each course in separate columns
//   Starting from column B (index 2), each course gets its own column
//   courses.forEach((course, courseIndex) => {
//     const columnIndex = courseIndex + 2; // Start from column B (index 2)

//     courseBatches[course].forEach((batch, batchIndex) => {
//       validationSheet.getCell(batchIndex + 1, columnIndex).value = batch;
//     });
//   });

//   Unlock all input cells
//   for (let rowIndex = 2; rowIndex <= 600; rowIndex++) {
//     const row = worksheet.getRow(rowIndex);
//     for (let colIndex = 1; colIndex <= headers.length; colIndex++) {
//       row.getCell(colIndex).protection = { locked: false };
//     }
//   }

//   Add validations
//   for (let rowIndex = 2; rowIndex <= 600; rowIndex++) {
//     Gender dropdown (F)
//     worksheet.getCell(`F${rowIndex}`).dataValidation = {
//       type: 'list',
//       formulae: ['"Male,Female,Other"'],
//       allowBlank: true,
//       showErrorMessage: true,
//       errorTitle: 'Invalid Gender',
//       error: 'Choose Male, Female or Other',
//     };

//     DOB validation (G)
//     worksheet.getCell(`G${rowIndex}`).dataValidation = {
//       type: 'date',
//       operator: 'lessThanOrEqual',
//       formulae: [new Date().toISOString().split('T')[0]],
//       showErrorMessage: true,
//       errorTitle: 'Invalid Date',
//       error: 'Date must not be in the future.',
//     };
//     worksheet.getCell(`G${rowIndex}`).numFmt = 'yyyy/mm/dd';

//     Course dropdown (H)
//     worksheet.getCell(`H${rowIndex}`).dataValidation = {
//       type: 'list',
//       formulae: [`ValidationData!$A$1:$A$${courses.length}`],
//       allowBlank: true,
//       showErrorMessage: true,
//       errorTitle: 'Invalid Course',
//       error: 'Choose from the course list',
//     };

//     Dynamic batch dropdown - shows all batches from all courses
//     const allBatches = Object.values(courseBatches).flat();
//     worksheet.getCell(`I${rowIndex}`).dataValidation = {
//       type: 'list',
//       formulae: [`"${allBatches.join(',')}"`],
//       allowBlank: true,
//       showErrorMessage: true,
//       errorTitle: 'Invalid Batch',
//       error: 'Choose the appropriate batch for your selected course',
//     };
//   }

//   Protect the worksheet
//   await worksheet.protect('your-secure-password', {
//     selectLockedCells: true,
//     selectUnlockedCells: true,
//     formatCells: false,
//     formatColumns: false,
//     formatRows: false,
//     insertColumns: false,
//     deleteColumns: false,
//   });

//   Send Excel file
//   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//   res.setHeader('Content-Disposition', 'attachment; filename="user_template.xlsx"');
//   await workbook.xlsx.write(res);
//   res.end();
// });

app.use('/api/v2', appRouter);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running at PORT ${PORT}`);
});
