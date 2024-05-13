import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';

export const fetchPostsByUserId = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-post-by-user-id.function'))(request);
  });
