export interface TemplateConfig {
  headers: string[];
  sampleData?: Record<string, any>[];
  columnWidths?: number[];
  sheetName?: string;
  filename?: string;
}

export interface ParsedRow {
  [key: string]: string;
}

export interface FileInfo {
  filename: string;
  size: number;
  mimeType: string;
  lastModified: Date;
}
