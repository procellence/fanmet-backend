import { Service } from 'typedi';
import { BaseDao } from './base.dao';
import { FOLLOWERS_COLLECTION } from '../collections';
import { Follow } from '../models/follow';

@Service()
export class FollowsDao extends BaseDao<Follow> {
  collectionName = FOLLOWERS_COLLECTION;

  async fetchFollowIdExist(followerId: string, followedId: string): Promise<Follow> {
    const response = await this.getCollection().findOne({ $and: [{ 'followerId': followerId }, { 'followedId': followedId }] });
    return response ? BaseDao.convertToEntity(response) : null;
  }
}
