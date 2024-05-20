import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { CALLS_COLLECTION } from '../collections';
import { Call } from '../models/call';

@Service()
export class CallsDao extends BaseDao<Call> {
  collectionName = CALLS_COLLECTION;

  async fetchById(fromUserId: string): Promise<Call[]> {
    return this.getCollection().find({
      fromUserId: fromUserId,
    }).toArray();
  }

  async isExist(id: string): Promise<boolean> {
    const result = await this.getCollection().find({ id: id }).toArray();
    return result.length != 0;
  }
}
