import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { UsersDao } from '../../dao/users.dao';
import { User } from '../../models/user';
import { FetchUserByEmailRequest } from '../../models/requests/user-requests';

const HttpsError = https.HttpsError;

@Service()
export default class FetchUserByEmailFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private usersDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<FetchUserByEmailRequest>): Promise<User[]> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);

    await this.validateRequest(userRequest.email);

    return this.usersDao.fetchUserById(userRequest.email);
  }

  private async validateRequest(email: string): Promise<void> {

    if (!email) {
      throw new HttpsError('not-found', 'email id is required');
    }

  }
}
