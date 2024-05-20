import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { PostsDao } from '../../dao/posts.dao';
import { DeletePostRequest } from '../../models/requests/post-requests';

const HttpsError = https.HttpsError;

@Service()
export default class DeletePostFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private postsDao: PostsDao,
  ) {
  }

  async main(req: CallableRequest<DeletePostRequest>): Promise<boolean> {
    const deleteRequest = req.data;
    this.logger.info('Request received', deleteRequest);
    await this.validateRequest(deleteRequest.id);
    return this.postsDao.delete(deleteRequest.id);
  }

  private async validateRequest(postId: string): Promise<void> {

    if (!postId) {
      throw new HttpsError('not-found', 'Post id is required');
    }

    const isPostIdExist = await this.postsDao.isExist(postId);

    if (!isPostIdExist) {
      throw new HttpsError('not-found', 'No post found for delete');
    }
  }
}
