import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { USERS_COLLECTION } from '../collections';
import { User } from '../models/user';

@Service()
export class UsersDao extends BaseDao<User> {
  collectionName = USERS_COLLECTION;


  async fetchUserById(email: string): Promise<User[]> {
    return this.getCollection().find({ email: email }).toArray();
  }

  async isEmailExist(email: string): Promise<boolean> {
    const result = await this.getCollection().find({ email: email }).toArray();
    return result.length != 0;
  }

  async isExist(userId: string): Promise<boolean> {
    const result = await this.getCollection().find({ id: userId }).toArray();
    return result.length != 0;
  }

}
