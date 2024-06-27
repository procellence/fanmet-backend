import { BaseDao } from './base.dao';
import { Service } from 'typedi';
import { CALLS_COLLECTION } from '../collections';
import { Call, CallRequestType } from '../models/call';

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

  async fetchByFromUserId(userId: string): Promise<Call[]> {
    const response = await this.getCollection()
      .aggregate([
        {
          $match: {
            $or: [
              { fromUserId: { $eq: userId } }, { toUserId: { $eq: userId } }],
          },
        },
        ...this.dataMappingStages,
      ]).toArray();

    return (response as Call[]).map(BaseDao.convertToEntity).map(call => {
      return {
        ...call,
        requestType: call.requestType == userId ? CallRequestType.OUTGOING : CallRequestType.INCOMING,
      };
    });
  }
}
