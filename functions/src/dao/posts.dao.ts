import { Service } from 'typedi';
import { BaseDao } from './base.dao';
import { POSTS_COLLECTION } from '../collections';
import { Post } from '../models/post';

@Service()
export class PostsDao extends BaseDao<Post> {
  collectionName = POSTS_COLLECTION;

  async fetchPostByUserId(userId: string): Promise<Post[]> {
    return this.getCollection().find({ userId }).toArray();
  }

  async isPostIdExist(userId: string): Promise<boolean> {
    const result = await this.getCollection().find({ id: userId }).toArray();
    return result.length != 0;
  }
}
