import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { CALLS_COLLECTION } from '../collections';
import { Call } from '../models/call';

@Service()
export class CallDao extends BaseDao<Call> {
  collectionName = CALLS_COLLECTION;

  async fetchCallDetailById(fromUserId: string, toUserId: string): Promise<Call[]> {
    return this.getCollection().find({ fromUserId: fromUserId, toUserId: toUserId }).toArray();
  }

  async isUserIdExist(id: string): Promise<boolean> {
    const result = await this.getCollection().find({ id: id }).toArray();
    return result.length != 0;
  }
}
