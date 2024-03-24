import { Db, MongoClient } from 'mongodb';
import { MONGODB_DB_NAME, MONGODB_URI } from '../constants';
import { Service } from 'typedi';

@Service()
export class MongoDatabaseService {
  private static client = new MongoClient(MONGODB_URI);
  private static db: Db;
  private static isConnected = false;

  constructor() {
  }

  static async connect() {
    if (this.isConnected) {
      return;
    }
    await this.client.connect();
    this.db = this.client.db(MONGODB_DB_NAME);
    this.isConnected = true;
  }

  static getDb(): Db {
    return this.db;
  }

  static isDbConnected(): boolean {
    return this.isConnected;
  }

  static async close() {
    await this.client.close();
    this.isConnected = false;
  }
}
