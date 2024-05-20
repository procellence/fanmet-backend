import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { UsersDao } from '../../dao/users.dao';
import { FetchUsersRequest } from '../../models/requests/user-requests';
import { User } from '../../models/user';

@Service()
export default class FetchUserFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private usersDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<FetchUsersRequest>): Promise<User[]> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);
    return this.usersDao.getAll();
  }
}
