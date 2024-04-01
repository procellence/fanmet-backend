import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { USERS_COLLECTION } from '../collections';
import { User } from '../models/user';

@Service()
export class UsersDao extends BaseDao<User> {
  collectionName = USERS_COLLECTION;

  async getByEmail(email: string): Promise<User> {
    const result = await this.getCollection().findOne({ email });
    const id = result._id;
    return id ? this.getById(id.toString()) : null;
  }
}
