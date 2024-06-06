import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallsDao } from '../../dao/calls.dao';
import { UpdateCallRequest } from '../../models/requests/call-requests';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';


@Service()
export default class UpdateCallFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private callsDao: CallsDao,
  ) {
  }

  async main(req: CallableRequest<UpdateCallRequest>): Promise<boolean> {
    const callRequest = req.data;
    this.logger.info('Request received', callRequest);
    await this.validateRequest(callRequest.id);
    return this.callsDao.update(callRequest.id, callRequest);
  }

  private async validateRequest(id: string): Promise<void> {

    if (!id) {
      throw new HttpsError('not-found', 'call details id is required');
    }

    const isCallExist = await this.callsDao.isExist(id);

    if (!isCallExist) {
      throw new HttpsError('not-found', 'Call details not found');
    }
  }
}

