import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { CallDao } from '../../dao/call.dao';
import { UpdateCallRequest } from '../../models/requests/call-request';

const HttpsError = https.HttpsError;

@Service()
export default class UpdateCallDetailsByIdFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private callDao: CallDao,
  ) {
  }

  async main(req: CallableRequest<UpdateCallRequest>): Promise<boolean> {
    const callRequest = req.data;
    this.logger.info('Request received', callRequest);
    await this.validateRequest(callRequest.id);
    return this.callDao.update(callRequest.id, callRequest);
  }

  private async validateRequest(id: string): Promise<void> {

    if (!id) {
      throw new HttpsError('not-found', 'id is required');
    }

    const isCallDetailsId = await this.callDao.isUserIdExist(id);

    if (!isCallDetailsId) {
      throw new HttpsError('not-found', 'sorry call details not found');
    }
  }
}

