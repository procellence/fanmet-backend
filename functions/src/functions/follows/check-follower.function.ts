import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { FollowsDao } from '../../dao/follows.dao';
import { FollowUserRequest } from '../../models/requests/follow-user-request';
import { Follow } from '../../models/follow';


@Service()
export default class CheckFollowerFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private followsDao: FollowsDao,
  ) {
  }

  async main(req: CallableRequest<FollowUserRequest>): Promise<Follow> {
    const followRequest = req.data;
    this.logger.info('Request received', followRequest);
    await this.validateRequest(followRequest);
    return this.followsDao.fetchFollowIdExist(followRequest.followerId, followRequest.followedId);

  }

  private async validateRequest(request: FollowUserRequest): Promise<void> {

    if (!request.followerId && !request.followedId) {
      throw new HttpsError('not-found', 'follower id and followed  id not found');
    }
  }
}
