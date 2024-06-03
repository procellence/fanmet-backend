import { Service } from 'typedi';
import { BaseDao } from './base.dao';
import { TRANSACTIONS_COLLECTION } from '../collections';
import { Transaction } from '../models/transaction';

@Service()
export class TransactionsDao extends BaseDao<Transaction> {
  collectionName = TRANSACTIONS_COLLECTION;
  dataMappingStages = [
    {
      $addFields: {
        'userObjectId': { $toObjectId: '$userId' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userObjectId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
  ];

  async fetchByUserId(userId: string): Promise<Transaction[]> {
    const response = await this.getCollection()
      .aggregate([
        {
          $match: {
            userId,
          },
        },
        ...this.dataMappingStages,
      ]).toArray();

    return response as Transaction[];
  }
}
