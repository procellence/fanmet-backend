import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { UsersDao } from '../../dao/users.dao';
import { FetchAllUserRequest } from '../../models/requests/user-request';
import { User } from '../../models/user';

@Service()
export default class FetchAllUserFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private userDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<FetchAllUserRequest>): Promise<User[]> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);
    return this.userDao.fetchAllUser();
  }
}
