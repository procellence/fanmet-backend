import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { UsersDao } from '../../dao/users.dao';
import { User } from '../../models/user';
import { RecommendUserRequest } from '../../models/requests/user-requests';


@Service()
export default class RecommendUserFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private usersDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<RecommendUserRequest>): Promise<User[]> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);

    return this.usersDao.getAll();
  }

}
