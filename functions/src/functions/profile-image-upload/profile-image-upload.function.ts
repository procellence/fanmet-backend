import { Service } from 'typedi';
import { StorageService } from '../../services/storage.service';
import { ProfileImageUploadRequest } from '../../models/profile-image-upload-request';
import { LoggerService } from '../../services/logger.service';
import { UsersDao } from '../../dao/users.dao';
import { CallableRequest, HttpsError } from 'firebase-functions/lib/common/providers/https';
import { User } from '../../models/user';
import { DEFAULT_BUCKET, PROFILE_IMAGE_UPLOAD_PATH } from '../../constants';
import { CallableResponse } from '../../models/callable-response';

@Service()
export default class ProfileImageUploadFunction {

  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private readonly storageService: StorageService,
    private readonly usersDao: UsersDao,
  ) {
  }

  async main(request: CallableRequest<ProfileImageUploadRequest>): Promise<CallableResponse> {
    const userEmail = request.auth.token.email;
    const data = request.data;
    this.logger.info('Request received', data);
    const { profileImageUrl } = data;
    const user = await this.usersDao.getByEmail(userEmail);
    if (!user) {
      throw new HttpsError('not-found', 'User not found');
    }
    const userId = user.id;
    const existingImageUrl = user.profileImageUrl;
    const destinationPath = `${PROFILE_IMAGE_UPLOAD_PATH}/${userId}`;
    const isFileMoved = await this.storageService.moveFileFromDownloadUrl(profileImageUrl, DEFAULT_BUCKET, destinationPath);
    if (!isFileMoved) {
      this.logger.error(new Error('Failed to move file'), profileImageUrl);
      return {
        success: false,
      };
    }
    // Todo get the new profile image url and set it in the user object.
    const newProfileImageUrl = `https://firebasestorage.googleapis.com/v0/b/${DEFAULT_BUCKET.replace(/^\//, '')}/o/${encodeURIComponent(destinationPath)}?alt=media`;
    await this.usersDao.update(userId, { profileImageUrl: newProfileImageUrl } as User);

    if (existingImageUrl) {
      await this.storageService.deleteFile(existingImageUrl);
      this.logger.info('Deleted existing profile image', existingImageUrl);
    }
    return {
      success: true,
    };
  }


}
