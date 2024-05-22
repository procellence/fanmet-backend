import { ModelBase } from '../utils/model-base';

export interface Transaction extends ModelBase {
  userId: string;
  type: TransactionType;
  amount: number;
}


enum TransactionType {
  DEPOSITED = 'DEPOSITED',
  WITHDRAWN = 'WITHDRAWN',
  CALLED = 'CALLED',
  CALL_RECEIVED = 'CALL_RECEIVED'
}
