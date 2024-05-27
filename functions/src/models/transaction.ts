import { ModelBase } from '../utils/model-base';

export interface Transaction extends ModelBase {
  userId: string;
  type: TransactionType;
  amount: number;
}


enum TransactionType {
  DEPOSITED = 'deposited',
  WITHDRAWN = 'withdrawn',
  CALLED = 'called',
  CALL_RECEIVED = 'call_received'
}
