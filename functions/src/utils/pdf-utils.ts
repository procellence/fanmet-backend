import { logger } from 'firebase-functions';
import * as fsExtra from 'fs-extra';
import { PDFDocument } from 'pdf-lib';
import { Service } from 'typedi';

@Service()
export class PdfUtils {

  // Merge multiple pdf files into one pdf file
  async mergeIntoOne(pdfFiles: string[], outputFilepath: string): Promise<boolean> {

    // Create a new document
    const newPDFDoc = await PDFDocument.create();
    const totalDocs = pdfFiles.length;

    for (let docNo = 0; docNo < totalDocs; docNo++) {
      const file = fsExtra.readFileSync(pdfFiles[docNo]);
      const donorPdfDoc = await PDFDocument.load(file);
      const docLength = donorPdfDoc.getPageCount();
      for (let page = 0; page < docLength; page++) {
        const [donorPage] = await newPDFDoc.copyPages(donorPdfDoc, [page]);
        newPDFDoc.addPage(donorPage);
      }
    }

    try {
      // Write it into a file
      fsExtra.outputFileSync(outputFilepath, await newPDFDoc.save());
    } catch (err: any) {
      logger.error('Failed to create output PDF file, reason :', err.message);
      return false;
    }

    return true;
  }
}
