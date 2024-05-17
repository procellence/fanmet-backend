import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { TransactionsDao } from '../../dao/transaction.dao';
import { FetchTransactionsRequest } from '../../models/requests/transaction-request';
import { Transaction } from '../../models/transaction';

const HttpsError = https.HttpsError;

@Service()
export default class FetchTransactionsFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private transactionsDao: TransactionsDao,
  ) {
  }

  async main(req: CallableRequest<FetchTransactionsRequest>): Promise<Transaction[]> {

    this.logger.info('Request received', req.data);

    this.validateRequest(req.data);

    return this.transactionsDao.fetchByUserId(req.data.userId);
  }

  private validateRequest(request: FetchTransactionsRequest): void {

    if (!request.userId) {
      throw new HttpsError('not-found', 'transaction id is required');
    }
  }
}
