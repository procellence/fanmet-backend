import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { CallsDao } from '../../dao/calls.dao';
import { AddCallRequest } from '../../models/requests/call-requests';

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
    return this.callsDao.create({ ...callRequest, callDurationTime: 0 });
  }

  private async validateRequest(fromUserId: string): Promise<void> {

    if (!fromUserId) {
      throw new HttpsError('not-found', 'call id is required');
    }

  }
}
