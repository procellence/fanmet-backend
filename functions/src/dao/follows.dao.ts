import { Service } from 'typedi';
import { BaseDao } from './base.dao';
import { FOLLOWERS_COLLECTION } from '../collections';
import { Follow } from '../models/follow';

@Service()
export class FollowsDao extends BaseDao<Follow> {
  collectionName = FOLLOWERS_COLLECTION;

  // async fetchById(userId: string): Promise<Follow[]> {
  //   const response = await this.getCollection().find({ userId }).toArray();
  //   return BaseDao.convertToEntities(response);
  // }
}
