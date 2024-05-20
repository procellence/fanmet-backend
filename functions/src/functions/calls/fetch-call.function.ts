import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { CallsDao } from '../../dao/calls.dao';
import { FetchCallsRequest } from '../../models/requests/call-requests';
import { Call } from '../../models/call';

const HttpsError = https.HttpsError;

@Service()
export default class FetchCallFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private callsDao: CallsDao,
  ) {
  }

  async main(req: CallableRequest<FetchCallsRequest>): Promise<Call[]> {
    const callRequest = req.data;
    this.logger.info('Request received', callRequest);
    await this.validateRequest(callRequest.fromUserId);
    return this.callsDao.fetchById(callRequest.fromUserId);
  }

  private async validateRequest(fromUserId: string): Promise<void> {

    if (!fromUserId) {
      throw new HttpsError('not-found', 'no call details found');
    }

  }
}
