import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { USERS_COLLECTION } from '../collections';
import { User } from '../models/user';

@Service()
export class UsersDao extends BaseDao<User> {
  collectionName = USERS_COLLECTION;

  async getByEmail(email: string): Promise<User> {
    const response = await this.getCollection().findOne({ email: email });
    return response ? BaseDao.convertToEntity(response) : null;
  }

  async isExistByEmail(email: string): Promise<boolean> {
    const result = await this.getCollection().find({ email: email }).toArray();
    return result.length != 0;
  }

}
