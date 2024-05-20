import { Transaction } from '../transaction';

export interface FetchTransactionsRequest {
  transactionId: string;
}

export interface AddTransactionRequest extends Omit<Transaction, 'id'> {

}
