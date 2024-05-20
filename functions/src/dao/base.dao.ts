import { Service } from 'typedi';
import { MongoDatabaseService } from '../services/mongo-database.service';
import { DataObject } from '../utils/generic-types';
import { Filter, ObjectId, OptionalUnlessRequiredId, WithId } from 'mongodb';


@Service()
export abstract class BaseDao<T = DataObject> {

  abstract collectionName: string;

  protected db = MongoDatabaseService.getDb();

  protected static convertToEntity<T>(item: WithId<T>) {
    const id = item._id.toHexString();
    delete item._id;
    return {
      ...item,
      id,
    } as T;
  }

  protected static convertToEntities<T>(items: WithId<T>[]) {
    return items.map((item) => BaseDao.convertToEntity(item));
  }

  protected static convertFromEntity<T>(item: T & { id: string }): WithId<T> {
    const id = item.id;
    delete item.id;
    return {
      ...item,
      _id: ObjectId.createFromHexString(id),
    } as WithId<T>;
  }

  async getById(id: string): Promise<T> {
    const response = await this.getCollection().findOne({
      _id: ObjectId.createFromHexString(id),
    } as Filter<T>);
    return response ? BaseDao.convertToEntity(response) : null;
  }

  async getAll(): Promise<T[]> {
    const response = await this.getCollection().find().toArray();
    return BaseDao.convertToEntities(response);
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

  async isExist(id: string): Promise<boolean> {
    const result = await this.getCollection().find({
      _id: ObjectId.createFromHexString(id),
    } as Filter<T>).toArray();
    return result.length != 0;
  }

  protected getCollection = () => this.db.collection<T>(this.collectionName);

}
