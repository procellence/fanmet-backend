import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { UsersDao } from '../../dao/users.dao';
import { UpdateUserRequest } from '../../models/requests/user-request';
import { https } from 'firebase-functions/lib/v2';

const HttpsError = https.HttpsError;

@Service()
export default class UpdateUserFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private userDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<UpdateUserRequest>): Promise<boolean> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);
    await this.validateRequest(userRequest.id);
    return this.userDao.update(userRequest.id, userRequest);
  }

  private async validateRequest(userId: string): Promise<void> {

    if (!userId) {
      throw new HttpsError('not-found', 'email id is required');
    }

    const isUserExist = await this.userDao.isUserIdExist(userId);
    if (!isUserExist) {
      throw new HttpsError('not-found', 'users id not exist in database');
    }
  }
}
