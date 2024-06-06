import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { TransactionsDao } from '../../dao/transactions.dao';
import { FetchTransactionsRequest } from '../../models/requests/transaction-requests';
import { Transaction } from '../../models/transaction';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

@Service()
export default class FetchTransactionFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private transactionsDao: TransactionsDao,
  ) {
  }

  async main(req: CallableRequest<FetchTransactionsRequest>): Promise<Transaction[]> {

    this.logger.info('Request received', req.data);

    this.validateRequest(req.data);

    return this.transactionsDao.fetchByUserId(req.data.transactionId);
  }

  private validateRequest(request: FetchTransactionsRequest): void {

    if (!request.transactionId) {
      throw new HttpsError('not-found', 'Transaction id is required');
    }
  }
}
