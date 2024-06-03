import { Service } from 'typedi';
import { BaseDao } from './base.dao';
import { POSTS_COLLECTION } from '../collections';
import { Post } from '../models/post';

@Service()
export class PostsDao extends BaseDao<Post> {
  collectionName = POSTS_COLLECTION;
  dataMappingStages = [
    {
      $addFields: {
        'userObjectId': { $toObjectId: '$userId' },
        'id': '$_id',
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

  async fetchPostByUserId(userId: string): Promise<Post[]> {
    const response = await this.getCollection()
      .aggregate([
        {
          $match: {
            userId,
          },
        },
        ...this.dataMappingStages,
      ]).toArray();

    return response as Post[];
  }
}
