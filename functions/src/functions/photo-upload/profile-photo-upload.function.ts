import { Service } from 'typedi';
import { PhotoUploadRequest, PhotoUploadSchema } from '../../schema/photo-upload-schema';
import { DefaultApiHandler } from '../default-api-handler';
import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
// import { Readable } from 'stream';
// import { MultipartFormParser } from '../../services/multipart-form-parser';
// import { StorageService } from '../../services/storage.service';
// import { DEFAULT_BUCKET } from '../../providers/firebase';
// import { v4 } from 'uuid';
// import { streamToBuffer } from '@function-utils/utils';
// import { PROFILE_IMAGE_UPLOAD_PATH } from '../../constants';
// import { ApiResponse } from '../../models/api-response';

@Service()
export default class ProfilePhotoUploadFunction extends DefaultApiHandler<PhotoUploadRequest> {

  constructor(
    // private readonly multipartFormParser: MultipartFormParser,
    // private readonly storageService: StorageService,
  ) {
    super();
  }

  async main(req: Request, res: Response) {
    try {
      this.logger.log('ProfilePhotoUploadFunction');
      return true;
      // this.validateRequestMethod(req, 'POST');
      // this.validateContentType(req, 'multipart/form-data');
      //
      // return await this.processRequest(req, res);
    } catch (err: any) {
      return this.errorHandling(err, res);
    }
  }

  parseRequest(data: PhotoUploadRequest): PhotoUploadRequest {
    return PhotoUploadSchema.parse(data);
  }

  // private async processRequest(req: https.Request, res: Response) {
  //   const parseRequest = await this.multipartFormParser.parseRequest(
  //     req,
  //     this.getFileUploader.bind(this),
  //   );
  //
  //   console.log(parseRequest);
  //
  //   return res.status(200).json({
  //     success: true,
  //   } as ApiResponse);
  // }
  //
  // private async getFileUploader(
  //   fileName: string,
  //   data: Readable,
  // ): Promise<string> {
  //   const bucketName = DEFAULT_BUCKET;
  //   const filepath = `${PROFILE_IMAGE_UPLOAD_PATH}/${v4()}/${fileName}`;
  //   await this.storageService.copyFileBuffer(
  //     bucketName,
  //     filepath,
  //     await streamToBuffer(data),
  //   );
  //   return `${bucketName}/${filepath}`;
  // }
}
