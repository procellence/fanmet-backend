import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
import { https } from 'firebase-functions/lib/v2';
import { TransactionsDao } from '../../dao/transaction.dao';
import { AddTransactionRequest } from '../../models/requests/transaction-request';

const HttpsError = https.HttpsError;

@Service()
export default class AddNewTransactionsFunction {
  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private transactionsDao: TransactionsDao,
  ) {
  }

  async main(req: CallableRequest<AddTransactionRequest>): Promise<string> {

    const transactionResponse = req.data;
    this.logger.info('Request received', transactionResponse);

    this.validateRequest(transactionResponse.userId);

    return this.transactionsDao.create(transactionResponse);
  }

  private validateRequest(userId: string): void {

    if (!userId) {
      throw new HttpsError('not-found', 'user id is required');
    }
  }
}
