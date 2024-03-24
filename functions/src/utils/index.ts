import { Container } from 'typedi';
import { logger } from 'firebase-functions/v2';
import { Request } from 'firebase-functions';
import { Response } from 'express';
import { MongoDatabaseService } from '../services/mongo-database.service';

export function loadFn(importFn: () => Promise<{
  default: new(...args: any[]) => { main(...args: any[]): Promise<any> }
}>) {
  return async (...args: any[]) => {
    await MongoDatabaseService.connect();
    if (!MongoDatabaseService.isDbConnected()) {
      logger.error('Database connection failed');
      return;
    }
    const module = await importFn();
    return await Container.get(module.default).main(...args)
      .finally(async () => await MongoDatabaseService.close());
  };
}

export async function processOnRequestFunction(req: Request, res: Response, importFn: () => Promise<{
  default: new(...args: any[]) => { main(...args: any[]): Promise<any> }
}>, params?: any[]): Promise<void> {
  const fn = loadFn(importFn);
  try {
    if (!params) {
      params = [req.body];
    }
    const result = await fn(...params);
    res.status(200).json(result);
  } catch (err: any) {
    logger.error(err);
    res.status(err.httpErrorCode ? err.httpErrorCode.status : 500).json({
      success: false,
      message: err.message || 'internal server error',
    });
  }
}
