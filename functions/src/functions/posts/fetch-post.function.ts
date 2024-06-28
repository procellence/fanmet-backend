import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { FetchPostsRequest } from '../../models/requests/post-requests';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import { PostsDao } from '../../dao/posts.dao';
import { Post } from '../../models/post';
import { sortDate } from '../../utils/utils';


@Service()
export default class FetchPostFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private postsDao: PostsDao,
  ) {
  }

  async main(req: CallableRequest<FetchPostsRequest>): Promise<Post[]> {
    const postsRequest = req.data;
    this.logger.info('Request received', postsRequest);

    this.validateRequest(req.data);
    if (postsRequest.userId) {
      return this.postsDao.fetchPostByUserId(postsRequest.userId);

    }
    const result = await this.postsDao.fetchPosts();
    return result.sort(sortDate);

  }

  private validateRequest(request: FetchPostsRequest): void {

    if (!request.postId && !request.userId) {
      throw new HttpsError('not-found', 'No post id or user id found');
    }
  }
}
