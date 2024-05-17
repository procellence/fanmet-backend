import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { AddNewPostRequest } from '../../models/requests/posts-request';
import { https } from 'firebase-functions/lib/v2';
import { PostsDao } from '../../dao/posts.dao';

const HttpsError = https.HttpsError;

@Service()
export default class AddNewPostFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private postsDao: PostsDao,
  ) {
  }

  async main(req: CallableRequest<AddNewPostRequest>): Promise<string> {

    const postRepose = req.data;
    this.logger.info('Request received', postRepose);

    this.validateRequest(postRepose.userId);

    return this.postsDao.create(postRepose);
  }

  private validateRequest(userId: string): void {

    if (!userId) {
      throw new HttpsError('not-found', 'post id is required');
    }
  }
}
