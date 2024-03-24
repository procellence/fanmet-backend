export interface UploadingFileInfo {
  fileName: string;
  fieldName?: string;
  uploadResult: { filePath: string } | string;
}

export interface ParsedMultipartForm {
  data?: { [name: string]: string };
  files?: UploadingFileInfo[];
}
