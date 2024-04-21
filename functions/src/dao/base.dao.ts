import { Service } from 'typedi';
import { MongoDatabaseService } from '../services/mongo-database.service';
import { ObjectId } from 'mongodb';


@Service()
export abstract class BaseDao<T> {

  abstract collectionName: string;

  protected db = MongoDatabaseService.getDb();

  async getById(id: string) {
    const response = await this.getCollection().findOne({
      _id: ObjectId.createFromHexString(id),
    });
    return response as T;
  }

  async getAll(): Promise<T[]> {
    const response = await this.getCollection().find().toArray();
    return response.map((item) => item as T);
  }

  async create(data: T): Promise<string> {
    const response = await this.getCollection().insertOne(data);
    return response.insertedId.id.toString();
  }

  async update(id: string, data: T): Promise<boolean> {
    const response = await this.getCollection().updateOne(
      {
        _id: ObjectId.createFromHexString(id),
      },
      {
        $set: data,
      },
    );
    return response.acknowledged;
  }

  protected getCollection = () => this.db.collection(this.collectionName);

}
