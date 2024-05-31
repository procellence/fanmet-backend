import { Service } from 'typedi';
import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import { LoggerService } from '../../services/logger.service';
import { PaymentResponse, PaymentStatus, TransactionStatus } from '../../models/transaction';
import { TransactionsDao } from '../../dao/transactions.dao';
import { UsersDao } from '../../dao/users.dao';


@Service()
export default class HandleRazorpayPaymentFunction {

  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private transactionsDao: TransactionsDao,
    private usersDao: UsersDao,
  ) {
  }

  async main(req: Request, res: Response) {

    const paymentResponse = req.body as PaymentResponse;

    const userEmailId = paymentResponse.payload.payment.entity.email;

    this.logger.debug(`Request received for user ${userEmailId}`, paymentResponse);

    const transactionId = paymentResponse.payload.payment.entity.description;
    const amount = paymentResponse.payload.payment.entity.amount;
    const paymentStatus = paymentResponse.payload.payment.entity.status;

    switch (paymentStatus) {
      case TransactionStatus.CREATED: {
        await this.transactionsDao.update(transactionId, { status: PaymentStatus.INPROGRESS });
        break;
      }
      case TransactionStatus.CAPTURED: {
        await this.transactionsDao.update(transactionId, { status: PaymentStatus.SUCCESS });
        const transactionResponse = await this.transactionsDao.getById(transactionId);
        const userResponse = await this.usersDao.getById(transactionResponse.userId);
        const finalAmount = userResponse.balance + amount;
        await this.usersDao.update(userResponse.id, { balance: finalAmount });
        break;
      }
      case TransactionStatus.AUTHORIZED: {
        await this.transactionsDao.update(transactionId, { status: PaymentStatus.INPROGRESS });

        break;
      }
      case TransactionStatus.FAILED: {
        await this.transactionsDao.update(transactionId, { status: PaymentStatus.FAILED });
        break;
      }
      default: {
        this.logger.debug(`Request received for user ${userEmailId}`, 'payment status in progress');
        break;
      }
    }
    res.status(200).send('Payment successful');
  }
}
