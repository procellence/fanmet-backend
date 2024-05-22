import { Transaction } from '../transaction';

export interface FetchTransactionsRequest {
  transactionId: string;
}

export interface AddTransactionRequest extends Pick<Transaction, 'userId' | 'createdAt' | 'updatedAt' | 'type' | 'amount'> {

}
