import { onCall } from 'firebase-functions/v2/https';
import { loadFn } from '../../utils';

export const fetchPosts = onCall(
  async (request) => {
    return loadFn(() => import('./fetch-post.function'))(request);
  });

export const addPost = onCall(
  async (request) => {
    return loadFn(() => import('./add-post.function'))(request);
  });

export const updatePost = onCall(
  async (request) => {
    return loadFn(() => import('./update-post.function'))(request);
  });

export const deletePost = onCall(
  async (request) => {
    return loadFn(() => import('./delete-post.function'))(request);
  });
