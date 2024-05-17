import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';


export const addNewCall = onCall(
  async (request) => {
    return loadFn(() => import('./add-new-call.function'))(request);
  });

export const fetchCallDetailById = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-call-details-by-id.function'))(request);
  });

export const updateCallDetails = onCall(
  async (request) => {
    return loadFn(() => import('./update-call-details-by-id.function'))(request);
  });
