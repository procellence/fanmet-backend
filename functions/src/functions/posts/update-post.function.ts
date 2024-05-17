import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { PostsDao } from '../../dao/posts.dao';
import { UpdatePostByUserIdRequest } from '../../models/requests/posts-request';

const HttpsError = https.HttpsError;

@Service()
export default class UpdatePostFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private postsDao: PostsDao,
  ) {
  }

  async main(req: CallableRequest<UpdatePostByUserIdRequest>): Promise<boolean> {
    const updateRequest = req.data;
    this.logger.info('Request received', updateRequest);
    await this.validateRequest(updateRequest.id);
    return this.postsDao.update(updateRequest.id, updateRequest);
  }

  private async validateRequest(userId: string): Promise<void> {

    if (!userId) {
      throw new HttpsError('not-found', 'userId id is required');
    }

    const isUserIdExist = await this.postsDao.isUserIdExist(userId);

    if (!isUserIdExist) {
      throw new HttpsError('not-found', 'no post found for update');
    }
  }
}
