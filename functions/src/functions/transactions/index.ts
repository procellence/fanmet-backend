import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';

export const fetchTransactionsByUserId = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-transactions.function'))(request);
  });

export const addTransactions = onCall(
  async (request) => {
    return loadFn(() => import('./add-new-transactions.function'))(request);
  });

