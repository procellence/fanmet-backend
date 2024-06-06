import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { UsersDao } from '../../dao/users.dao';
import { UpdateUserRequest } from '../../models/requests/user-requests';
import { User } from '../../models/user';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

@Service()
export default class UpdateUserFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private usersDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<UpdateUserRequest>): Promise<User> {
    const userRequest = req.data;
    this.logger.info('Request received', userRequest);
    await this.validateRequest(userRequest.id);
    const id = userRequest.id;
    delete userRequest.id;
    const result = this.usersDao.update(id, userRequest);
    return result ? this.usersDao.getById(id) : null;
  }

  private async validateRequest(userId: string): Promise<void> {

    if (!userId) {
      throw new HttpsError('not-found', 'Email id is required');
    }

    const isIdExist = await this.usersDao.isExist(userId);
    if (!isIdExist) {
      throw new HttpsError('not-found', 'User id not exist in database');
    }
  }
}
