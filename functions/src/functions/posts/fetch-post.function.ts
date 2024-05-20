import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { FetchPostsRequest } from '../../models/requests/post-requests';
import { https } from 'firebase-functions/lib/v2';
import { PostsDao } from '../../dao/posts.dao';
import { Post } from '../../models/post';

const HttpsError = https.HttpsError;

@Service()
export default class FetchPostFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private postsDao: PostsDao,
  ) {
  }

  async main(req: CallableRequest<FetchPostsRequest>): Promise<Post[]> {

    this.logger.info('Request received', req.data);

    this.validateRequest(req.data);

    return this.postsDao.getAll();
  }

  private validateRequest(request: FetchPostsRequest): void {

    if (!request.postId) {
      throw new HttpsError('not-found', 'post id is required');
    }
  }
}
