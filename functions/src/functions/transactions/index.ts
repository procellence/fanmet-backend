import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';

export const fetchTransactions = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-transaction.function'))(request);
  });

export const addTransaction = onCall(
  async (request) => {
    return loadFn(() => import('./add-transaction.function'))(request);
  });

