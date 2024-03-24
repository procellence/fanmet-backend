import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { USERS_COLLECTION } from '../collections';

@Service()
export class UsersDao extends BaseDao<any> {
  collectionName = USERS_COLLECTION;
}
