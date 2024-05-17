import { Transaction } from '../transaction';

export interface FetchTransactionsRequest {
  userId: string;
}

export interface AddTransactionRequest extends Omit<Transaction, 'id'> {

}
