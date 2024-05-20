import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { CallsDao } from '../../dao/calls.dao';
import { UpdateCallRequest } from '../../models/requests/call-requests';

const HttpsError = https.HttpsError;

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

