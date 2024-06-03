import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { CALLS_COLLECTION } from '../collections';
import { Call } from '../models/call';

@Service()
export class CallsDao extends BaseDao<Call> {
  collectionName = CALLS_COLLECTION;
  dataMappingStages = [
    {
      $addFields: {
        'fromUserObjectId': { $toObjectId: '$fromUserId' },
        'toUserObjectId': { $toObjectId: '$toUserId' },
        'id': '$_id',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'fromUserObjectId',
        foreignField: '_id',
        as: 'fromUser',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'toUserObjectId',
        foreignField: '_id',
        as: 'toUser',
      },
    },
    {
      $unwind: '$fromUser',
    },
    {
      $unwind: '$toUser',
    },
  ];

  async fetchByFromUserId(fromUserId: string): Promise<Call[]> {
    const response = await this.getCollection()
      .aggregate([
        {
          $match: {
            fromUserId,
          },
        },
        ...this.dataMappingStages,
      ]).toArray();

    return response as Call[];
  }
}
