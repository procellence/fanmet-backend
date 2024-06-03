import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { UsersDao } from '../../dao/users.dao';
import { User } from '../../models/user';
import { RecommendUserRequest } from '../../models/requests/user-requests';
import { CallableRequest } from 'firebase-functions/v2/https';


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
