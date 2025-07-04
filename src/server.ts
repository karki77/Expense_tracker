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

app.get('/template', async (_req, res) => {
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
});

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
