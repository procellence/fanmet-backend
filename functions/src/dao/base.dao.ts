import { Service } from 'typedi';
import { MongoDatabaseService } from '../services/mongo-database.service';
import { DataObject } from '../utils/generic-types';
import { Filter, ObjectId, OptionalUnlessRequiredId, WithId } from 'mongodb';
import { DateTime } from 'luxon';
import { Document } from 'bson/src/bson';
import { isArray } from 'lodash';


@Service()
export abstract class BaseDao<T = DataObject> {
  abstract collectionName: string;
  protected db = MongoDatabaseService.getDb();
  protected dataMappingStages: any[] = [];

  protected static convertToEntity<T>(item: WithId<T> | Document) {
    if (!item._id) {
      return item as T;
    }
    const id = item._id.toHexString();
    delete item._id;

    // check if any property is an object and then apply the same logic to it
    Object.keys(item).forEach((key) => {
      if ((item as any)[key] && typeof (item as any)[key] === 'object' && !isArray((item as any)[key])) {
        (item as any)[key] = BaseDao.convertToEntity((item as any)[key]);
      }
    });

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

    if (this.dataMappingStages.length > 0) {
      const response = await this.getCollection().aggregate([
        {
          $match: {
            _id: ObjectId.createFromHexString(id),
          },
        },
        ...this.dataMappingStages,
      ]).toArray();

      return response.length > 0 ? BaseDao.convertToEntity(response as T) : null;
    }

    const response = await this.getCollection().findOne({
      _id: ObjectId.createFromHexString(id),
    } as Filter<T>);
    return response ? BaseDao.convertToEntity(response) : null;
  }

  async getAll(): Promise<T[]> {

    if (this.dataMappingStages.length > 0) {
      const response = await this.getCollection().aggregate([
        ...this.dataMappingStages,
      ]).toArray();
      return (response as T[]).map(BaseDao.convertToEntity);
    }

    const response = await this.getCollection().find().toArray();
    return BaseDao.convertToEntities(response);
  }

  async create(data: T): Promise<string> {
    const currentTimeInIso = DateTime.now().toISO();
    const response = await this.getCollection().insertOne({
      ...data,
      createdAt: currentTimeInIso,
      updatedAt: currentTimeInIso,
    } as OptionalUnlessRequiredId<T>);
    return response.insertedId.toHexString();
  }

  async update(id: string, data: Partial<T>): Promise<boolean> {
    const response = await this.getCollection().updateOne(
      {
        _id: ObjectId.createFromHexString(id),
      } as Filter<T>,
      {
        $set: {
          ...data,
          updatedAt: DateTime.now().toISO(),
        },
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
