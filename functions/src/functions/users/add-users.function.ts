import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { UsersDao } from '../../dao/users.dao';
import { AddUserRequest } from '../../models/requests/user-request';
import { https } from 'firebase-functions/lib/v2';

const HttpsError = https.HttpsError;

@Service()
export default class AddUserFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private userDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<AddUserRequest>): Promise<string> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);
    await this.validateRequest(userRequest.email);
    return this.userDao.create(userRequest);
  }

  private async validateRequest(email: string): Promise<void> {

    if (!email) {
      throw new HttpsError('not-found', 'email id is required');
    }

    const isUserEmailIdExist = await this.userDao.isUserEmailIdExist(email);
    if (isUserEmailIdExist) {
      throw new HttpsError('already-exists', 'email is already exit');
    }
  }
}
