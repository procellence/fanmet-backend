import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { CallDao } from '../../dao/call.dao';
import { AddNewCallRequest } from '../../models/requests/call-request';
import { Call } from '../../models/call';

const HttpsError = https.HttpsError;

@Service()
export default class FetchCallDetailsByIdFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private callDao: CallDao,
  ) {
  }

  async main(req: CallableRequest<AddNewCallRequest>): Promise<Call[]> {
    const callRequest = req.data;
    this.logger.info('Request received', callRequest);
    await this.validateRequest(callRequest.fromUserId, callRequest.toUserId);
    return this.callDao.fetchCallDetailById(callRequest.fromUserId, callRequest.toUserId);
  }

  private async validateRequest(fromUserId: string, toUserId: string): Promise<void> {

    if (!fromUserId || !toUserId) {
      throw new HttpsError('not-found', 'no call details found');
    }

  }
}
