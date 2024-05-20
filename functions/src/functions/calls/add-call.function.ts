import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { CallsDao } from '../../dao/calls.dao';
import { AddCallRequest } from '../../models/requests/call-requests';

const HttpsError = https.HttpsError;

@Service()
export default class AddCallFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private callsDao: CallsDao,
  ) {
  }

  async main(req: CallableRequest<AddCallRequest>): Promise<string> {
    const callRequest = req.data;
    this.logger.info('Request received', callRequest);
    await this.validateRequest(callRequest.fromUserId);
    return this.callsDao.create(callRequest);
  }

  private async validateRequest(fromUserId: string): Promise<void> {

    if (!fromUserId) {
      throw new HttpsError('not-found', 'call id is required');
    }

  }
}
