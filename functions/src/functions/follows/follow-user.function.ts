import { Service } from 'typedi';
import { FollowUserRequest } from '../../models/requests/follow-user-request';
import { LoggerService } from '../../services/logger.service';
import { MongoDatabaseService } from '../../services/mongo-database.service';
import { FOLLOWERS_COLLECTION, USERS_COLLECTION } from '../../collections';
import { ObjectId } from 'mongodb';
import { MONGODB_DB_NAME } from '../../constants';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';


@Service()
export default class FollowUserFunction {

  private readonly logger = LoggerService.getLogger(this);

  async main(req: CallableRequest<FollowUserRequest>): Promise<boolean> {

    this.logger.info('Request received', req.data);

    this.validateRequest(req.data);

    await this.writeToDatabase(req.data);

    return true;

  }

  private validateRequest(request: FollowUserRequest): void {
    if (!request.followerId) {
      throw new HttpsError('not-found', 'Follower id is required');
    }

    if (!request.followedId) {
      throw new HttpsError('not-found', 'Followed id is required');
    }

    if (request.isFollowing === undefined) {
      throw new HttpsError('not-found', 'Following is required');
    }
  }

  private async writeToDatabase(request: FollowUserRequest): Promise<void> {
    const { followerId, followedId, isFollowing } = request;

    const client = MongoDatabaseService.getClient();
    const session = client.startSession();
    session.startTransaction();

    const db = client.db(MONGODB_DB_NAME);

    // 1. Add a record in the following collection if isFollowing is true or remove the record if isFollowing is false
    // 2. Update the followers count in the users collection (followUserId)
    // 3. Update the following count in the users collection (userId)

    if (isFollowing) {
      // Add a record in the following collection
      await db.collection(FOLLOWERS_COLLECTION).insertOne({
        followerId,
        followedId,
      });
    } else {

      // Check if the record exists in the following collection
      const record = await db.collection(FOLLOWERS_COLLECTION).findOne({
        followerId,
        followedId,
      });

      if (!record) {
        throw new HttpsError('invalid-argument', 'User is not following the other users');
      }

      // Remove the record from the following collection
      await db.collection(FOLLOWERS_COLLECTION).deleteOne({
        followerId,
        followedId,
      });
    }

    // Update the followers count in the users collection (followedId)
    await db.collection(USERS_COLLECTION).updateOne(
      { _id: ObjectId.createFromHexString(followedId) },
      { $inc: { followers: isFollowing ? 1 : -1 } },
    );

    // Update the following count in the users collection (followerId)
    await db.collection(USERS_COLLECTION).updateOne(
      { _id: ObjectId.createFromHexString(followerId) },
      { $inc: { following: isFollowing ? 1 : -1 } },
    );

    await session.commitTransaction();
  }
}
