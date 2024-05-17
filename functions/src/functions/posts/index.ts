import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';

export const fetchPostsByUserId = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-post-by-user-id.function'))(request);
  });

export const addNewPost = onCall(
  async (request) => {
    return loadFn(() => import('./add-new-post.function'))(request);
  });

export const updatePost = onCall(
  async (request) => {
    return loadFn(() => import('./update-post.function'))(request);
  });

export const deletePost = onCall(
  async (request) => {
    return loadFn(() => import('./delete-post.function'))(request);
  });
