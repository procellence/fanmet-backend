import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { UsersDao } from '../../dao/users.dao';
import { AddUserRequest } from '../../models/requests/user-requests';
import { https } from 'firebase-functions/lib/v2';

const HttpsError = https.HttpsError;

@Service()
export default class AddUserFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private usersDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<AddUserRequest>): Promise<string> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);
    await this.validateRequest(userRequest.email);
    return this.usersDao.create(userRequest);
  }

  private async validateRequest(email: string): Promise<void> {

    if (!email) {
      throw new HttpsError('not-found', 'email id is required');
    }

    const isExistByEmail = await this.usersDao.isExistByEmail(email);
    if (isExistByEmail) {
      throw new HttpsError('already-exists', `User already exists with this email [${email}]`);
    }
  }
}
