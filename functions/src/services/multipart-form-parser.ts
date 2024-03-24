import Busboy, { FileInfo } from 'busboy';
import { https } from 'firebase-functions';
import { createWriteStream, ReadStream } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import sanitize from 'sanitize-filename';
import { Readable } from 'stream';
import { Service } from 'typedi';
import { ParsedMultipartForm } from '../models/form-parser';

@Service()
export class MultipartFormParser {
  public async parseRequest(
    req: https.Request,
    fileUploader: (
      fileName: string,
      data: Readable
    ) => Promise<any> | null = this.defaultFileUploader,
  ): Promise<ParsedMultipartForm> {
    const busboy = Busboy({
      headers: req.headers,
    });

    const result: ParsedMultipartForm = {
      data: {},
      files: [],
    };

    const fileProcess: Promise<any>[] = [];

    return new Promise((resolve, reject) => {
      busboy.on('field', (fieldName: string, val: string) => {
        result.data[fieldName] = val;
      });

      if (fileUploader) {
        busboy.on(
          'file',
          async (fieldName: string, file: ReadStream, fileInfo: FileInfo) => {
            const fileName = sanitize(fileInfo.filename).replace(/'/g, '');
            const uploadPromise = fileUploader(fileName, file)
              .then((uploadResult) => {
                result.files.push({
                  fileName,
                  fieldName,
                  uploadResult,
                });
              })
              .catch((err) => {
                reject(err);
              });

            fileProcess.push(uploadPromise);
          },
        );
      }

      busboy.on('finish', async () => {
        await Promise.all(fileProcess);
        resolve(result);
      });

      busboy.end(req.rawBody);
    });
  }

  private async defaultFileUploader(
    fileName: string,
    file: Readable,
  ): Promise<{ filePath: string }> {
    const filePath = path.join(tmpdir(), fileName);
    const writeStream = createWriteStream(filePath);
    file.pipe(writeStream);
    return new Promise((resolve, reject) => {
      file.on('end', () => {
        writeStream.end();
      });
      writeStream.on('finish', () => {
        resolve({ filePath });
      });
      writeStream.on('error', reject);
    });
  }
}
