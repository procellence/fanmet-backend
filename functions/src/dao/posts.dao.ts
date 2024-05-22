import { Service } from 'typedi';
import { BaseDao } from './base.dao';
import { POSTS_COLLECTION } from '../collections';
import { Post } from '../models/post';

@Service()
export class PostsDao extends BaseDao<Post> {
  collectionName = POSTS_COLLECTION;

  async fetchPostByUserId(userId: string): Promise<Post[]> {
    const response = await this.getCollection().find({ userId }).toArray();
    return BaseDao.convertToEntities(response);
  }
}
