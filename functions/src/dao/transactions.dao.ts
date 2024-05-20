import { Service } from 'typedi';
import { BaseDao } from './base.dao';
import { TRANSACTIONS_COLLECTION } from '../collections';
import { Transaction } from '../models/transaction';

@Service()
export class TransactionsDao extends BaseDao<Transaction> {
  collectionName = TRANSACTIONS_COLLECTION;

  async fetchById(userId: string): Promise<Transaction[]> {
    return this.getCollection().find({ userId }).toArray();
  }
}
