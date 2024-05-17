import { Service } from 'typedi';
import { MongoDatabaseService } from '../services/mongo-database.service';
import { DataObject } from '../utils/generic-types';
import { Filter, ObjectId, OptionalUnlessRequiredId } from 'mongodb';


@Service()
export abstract class BaseDao<T = DataObject> {

  abstract collectionName: string;

  protected db = MongoDatabaseService.getDb();

  async getById(id: string) {
    return this.getCollection().findOne({
      _id: ObjectId.createFromHexString(id),
    } as Filter<T>);
  }

  async getAll(): Promise<T[]> {
    const response = await this.getCollection().find().toArray();
    return response.map((item) => item as T);
  }

  async create(data: T): Promise<string> {
    const response = await this.getCollection().insertOne(data as OptionalUnlessRequiredId<T>);
    return response.insertedId.id.toString();
  }

  async update(id: string, data: Partial<T>): Promise<boolean> {
    const response = await this.getCollection().updateOne(
      {
        _id: ObjectId.createFromHexString(id),
      } as Filter<T>,
      {
        $set: data,
      },
    );
    return response.acknowledged;
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.getCollection().deleteOne({
        _id: ObjectId.createFromHexString(id),
      } as Filter<T>,
    );
    return response.acknowledged;
  }

  protected getCollection = () => this.db.collection<T>(this.collectionName);

}
