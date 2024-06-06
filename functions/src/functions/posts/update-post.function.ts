import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { PostsDao } from '../../dao/posts.dao';
import { UpdatePostRequest } from '../../models/requests/post-requests';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';


@Service()
export default class UpdatePostFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private postsDao: PostsDao,
  ) {
  }

  async main(req: CallableRequest<UpdatePostRequest>): Promise<boolean> {
    const updateRequest = req.data;
    this.logger.info('Request received', updateRequest);
    await this.validateRequest(updateRequest.id);
    return this.postsDao.update(updateRequest.id, updateRequest);
  }

  private async validateRequest(postId: string): Promise<void> {

    if (!postId) {
      throw new HttpsError('not-found', 'post id is required');
    }

    const isPostIdExist = await this.postsDao.isExist(postId);

    if (!isPostIdExist) {
      throw new HttpsError('not-found', 'No post found for update');
    }
  }
}
