import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallsDao } from '../../dao/calls.dao';
import { FetchCallsRequest } from '../../models/requests/call-requests';
import { Call } from '../../models/call';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

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
    const data = await this.callsDao.fetchByFromUserId(callRequest.fromUserId);
    this.logger.info('Response', data);
    return data;
  }

  private async validateRequest(fromUserId: string): Promise<void> {

    if (!fromUserId) {
      throw new HttpsError('not-found', 'no call details found');
    }

  }
}
