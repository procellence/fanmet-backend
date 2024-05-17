import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';


export const addUser = onCall(
  async (request) => {
    return loadFn(() => import('./add-users.function'))(request);
  });

export const updateUser = onCall(
  async (request) => {
    return loadFn(() => import('./add-users.function'))(request);
  });

export const fetchUserByEmail = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-user-detail-by-email.function'))(request);
  });

export const fetchAllUser = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-all-user.function'))(request);
  });
