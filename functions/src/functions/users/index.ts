import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';


export const addUser = onCall(
  async (request) => {
    return loadFn(() => import('./add-user.function'))(request);
  });

export const updateUser = onCall(
  async (request) => {
    return loadFn(() => import('./add-user.function'))(request);
  });

export const fetchUserByEmail = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-user-by-email.function'))(request);
  });

export const fetchUsers = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-user.function'))(request);
  });
