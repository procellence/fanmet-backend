import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { CallDao } from '../../dao/call.dao';
import { AddNewCallRequest } from '../../models/requests/call-request';

const HttpsError = https.HttpsError;

@Service()
export default class AddNewCallFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private callDao: CallDao,
  ) {
  }

  async main(req: CallableRequest<AddNewCallRequest>): Promise<string> {
    const callRequest = req.data;
    this.logger.info('Request received', callRequest);
    await this.validateRequest(callRequest.fromUserId, callRequest.toUserId);
    return this.callDao.create(callRequest);
  }

  private async validateRequest(fromUserId: string, toUserId: string): Promise<void> {

    if (!fromUserId || !toUserId) {
      throw new HttpsError('not-found', 'id is required');
    }

  }
}
