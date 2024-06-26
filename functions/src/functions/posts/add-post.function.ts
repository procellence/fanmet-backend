import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { AddPostRequest } from '../../models/requests/post-requests';
import { PostsDao } from '../../dao/posts.dao';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

@Service()
export default class AddPostFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private postsDao: PostsDao,
  ) {
  }

  async main(req: CallableRequest<AddPostRequest>): Promise<string> {

    const postRepose = req.data;
    this.logger.info('Request received', postRepose);

    this.validateRequest(postRepose.userId);

    return this.postsDao.create({ ...postRepose, likes: 0 });
  }

  private validateRequest(postId: string): void {

    if (!postId) {
      throw new HttpsError('not-found', 'Post id is required');
    }
  }
}
