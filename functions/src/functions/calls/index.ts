import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';


export const addCall = onCall(
  async (request) => {
    return loadFn(() => import('./add-call.function'))(request);
  });

export const fetchCalls = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-call.function'))(request);
  });

export const updateCall = onCall(
  async (request) => {
    return loadFn(() => import('./update-call.function'))(request);
  });
