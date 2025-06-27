// Core data interfaces
export interface MediaRequestData {
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  batch: string;
}

export interface ProcessedExcelData {
  headers: string[];
  data: any[];
  filename: string;
  originalName: string;
  totalRows: number;
  parsedForMedia: MediaRequestData[];
}

// Media request service interfaces
export interface MediaRequestResponse {
  success: boolean;
  message: string;
  totalProcessed: number;
  validRecords: number;
  invalidRecords: number;
  errors: string[];
  data?: MediaRequestData[];
}

export interface MediaRequestOptions {
  validateEmail?: boolean;
  requireAllFields?: boolean;
  skipInvalidRecords?: boolean;
  validateCourse?: boolean;
  validateBatch?: boolean;
}

export interface MediaRequestStats {
  totalRows: number;
  hasFirstName: number;
  hasLastName: number;
  hasEmail: number;
  hasCourse: number;
  hasBatch: number;
  completeRecords: number;
}

export interface MediaRequestPreview {
  preview: MediaRequestData[];
  totalRecords: number;
  headers: string[];
}

// Validation result interface
export interface ValidationResult {
  validRecords: MediaRequestData[];
  invalidRecords: MediaRequestData[];
  errors: string[];
}
