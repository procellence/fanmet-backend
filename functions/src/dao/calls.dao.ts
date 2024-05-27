import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { CALLS_COLLECTION } from '../collections';
import { Call } from '../models/call';

@Service()
export class CallsDao extends BaseDao<Call> {
  collectionName = CALLS_COLLECTION;

  async fetchById(fromUserId: string): Promise<Call[]> {
    const response = await this.getCollection().find({ fromUserId }).toArray();
    return BaseDao.convertToEntities(response);
  }
}
