import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { PostsDao } from '../../dao/posts.dao';
import { DeletePostByUserIdRequest } from '../../models/requests/posts-request';

const HttpsError = https.HttpsError;

@Service()
export default class DeletePostFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private postsDao: PostsDao,
  ) {
  }

  async main(req: CallableRequest<DeletePostByUserIdRequest>): Promise<boolean> {
    const deleteRequest = req.data;
    this.logger.info('Request received', deleteRequest);
    await this.validateRequest(deleteRequest.id);
    return this.postsDao.delete(deleteRequest.id);
  }

  private async validateRequest(userId: string): Promise<void> {

    if (!userId) {
      throw new HttpsError('not-found', 'post id is required');
    }

    const deletePostIdExist = await this.postsDao.isPostIdExist(userId);

    if (!deletePostIdExist) {
      throw new HttpsError('not-found', 'no post found for delete');
    }
  }
}
