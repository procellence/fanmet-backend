import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallsDao } from '../../dao/calls.dao';
import { AddCallRequest } from '../../models/requests/call-requests';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import { CallRequestType } from '../../models/call';

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
    return this.callsDao.create({ ...callRequest, callDurationTime: 0, requestType: CallRequestType.OUTGOING });
  }

  private async validateRequest(fromUserId: string): Promise<void> {

    if (!fromUserId) {
      throw new HttpsError('not-found', 'call id is required');
    }

  }
}
