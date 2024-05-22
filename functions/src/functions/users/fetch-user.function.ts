import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { UsersDao } from '../../dao/users.dao';
import { User } from '../../models/user';
import { FetchUserRequest } from '../../models/requests/user-requests';


@Service()
export default class FetchUserFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private usersDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<FetchUserRequest>): Promise<User> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);

    await this.validateRequest(userRequest);
    if (userRequest.email) {
      return this.usersDao.getByEmail(userRequest.email);
    }
    return this.usersDao.getById(userRequest.id);
  }

  private async validateRequest(request: FetchUserRequest): Promise<void> {

    if (!request.email && !request.id) {
      throw new HttpsError('not-found', 'No email id or  id found');
    }

  }
}
