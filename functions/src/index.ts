import './polyfills';
import { onRequest } from 'firebase-functions/v2/https';
import { loadFn } from './utils';

// Will be adding more to this file soon. Stay tuned!

export const profileImageUpload = onRequest(
  async (request) => {
    return loadFn(() => import('./functions/photo-upload/profile-photo-upload.function'))(request);
  });
