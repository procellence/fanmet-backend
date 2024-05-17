export interface Transaction {
  id?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  type: TransactionType;
  amount: number
}


enum TransactionType {
  DEPOSITED = 'DEPOSITED',
  WITHDRAWN = 'WITHDRAWN',
  CALLED = 'CALLED',
  CALL_RECEIVED = 'CALL_RECEIVED'
}
