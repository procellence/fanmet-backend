import { onCall, onRequest } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';

export const fetchTransactions = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-transaction.function'))(request);
  });

export const addTransaction = onCall(
  async (request) => {
    return loadFn(() => import('./add-transaction.function'))(request);
  });

export const handleRazorpayPayments = onRequest(async (req, res) => {
  return loadFn(() => import('./handle-razorpay-payment.function'))(req, res);
});

