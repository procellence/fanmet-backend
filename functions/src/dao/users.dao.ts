import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { USERS_COLLECTION } from '../collections';
import { User } from '../models/user';

@Service()
export class UsersDao extends BaseDao<User> {
  collectionName = USERS_COLLECTION;


  async fetchUserByUserEmailId(email: string): Promise<User[]> {
    return this.getCollection().find({ email: email }).toArray();
  }

  async isUserExist(email: string): Promise<boolean> {
    const result = await this.getCollection().find({ email: email }).toArray();
    return result.length != 0;
  }

  async isUserIdExist(userId: string): Promise<boolean> {
    const result = await this.getCollection().find({ id: userId }).toArray();
    return result.length != 0;
  }

  async fetchAllUser(): Promise<User[]> {
    return this.getCollection().find().toArray();
  }
}
