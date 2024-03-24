import { Service } from 'typedi';
import { logger } from 'firebase-functions/v2';
import { v4 } from 'uuid';
import { CreateOptions } from '@google-cloud/storage/build/src/nodejs-common/service-object';
import { File } from '@google-cloud/storage';
import { DateTime } from 'luxon';
import { app, DEFAULT_BUCKET } from '../providers/firebase';

@Service()
export class StorageService {
  public async uploadFile(fileName: string, fileData: Buffer, contentType: string, bucketName = DEFAULT_BUCKET): Promise<string> {

    const uuid = v4();

    return new Promise<string>((resolve, reject) => {
      const bucket = app.storage().bucket(bucketName);
      const blobWriter = bucket.file(fileName).createWriteStream({
        metadata: {
          contentType,
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      });

      blobWriter.on('error', (err) => {
        logger.error('Write file to firebase storage error', err);
        reject(err);
      });

      blobWriter.on('finish', () => {
        resolve(`https://firebasestorage.googleapis.com/v0/b/${bucketName.replace(/^\//, '')}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`);
      });

      blobWriter.end(fileData);
    });
  }

  public async moveFile(bucket: string, fileName: string, destinationBucket: string): Promise<void> {
    const newBucket = app.storage().bucket(destinationBucket);
    await app.storage().bucket(bucket).file(fileName)
      .move(newBucket);
    logger.log('StorageService.moveFile completed. File moved', {
      bucket,
      destinationBucket,
      fileName,
    });
  }

  public async createBucket(bucketName: string, metadata?: CreateOptions, deleteRuleDaysCount: number = null): Promise<boolean> {
    logger.debug('createBucket function call', bucketName, metadata, deleteRuleDaysCount);
    const bucket = app.storage().bucket(bucketName);
    const [exists] = await bucket.exists();
    if (exists) {
      return false;
    }
    await bucket.create(metadata);
    if (deleteRuleDaysCount) {
      await bucket.addLifecycleRule({
        action: 'delete',
        condition: { age: deleteRuleDaysCount },
      });
    }

    return true;
  }

  async getFile(filepath: string, bucket = DEFAULT_BUCKET): Promise<File> {
    return app.storage().bucket(bucket).file(filepath);
  }

  async getSignedUrl(filepath: string, expiresInMinutes = 1, bucket = DEFAULT_BUCKET): Promise<string> {
    const file = await this.getFile(filepath, bucket);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: DateTime.now().plus({ minute: expiresInMinutes }).toJSDate(),
    });
    return url;
  }

  async copyFileBuffer(
    bucketName: string,
    filepath: string,
    fileBuffer: Buffer,
  ): Promise<any> {
    await app.storage().bucket(bucketName).file(filepath).save(fileBuffer);
  }
}
