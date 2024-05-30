import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';

export const followUser = onCall(
  async (request) => {
    return loadFn(() => import('./follow-user.function'))(request);
  });

export const checkFollower = onCall(
  async (request) => {
    return loadFn(() => import('./check-follower.function'))(request);
  });
