import './polyfills';
import { onCall, onRequest } from 'firebase-functions/v2/https';
import { loadFn } from './utils';

// Will be adding more to this file soon. Stay tuned!
export const profileImageUpload = onRequest(
  async (request) => {
    return loadFn(() => import('./functions/photo-upload/profile-photo-upload.function'))(request);
  });

export const getAgoraToken = onCall(
  async (request) => {
    return loadFn(() => import('./functions/agora-token-generator/agora-token-generator.function'))(request);
  });

export const posts = require('./functions/posts');

export const transactions = require('./functions/transactions');

export const users = require('./functions/users');

export const calls = require('./functions/calls');

export const follows = require('./functions/follows');

export const sendFcmNotification = onRequest(async (req, res) => {
  return loadFn(() => import('./functions/fcm-notification/send-fcm-notification.function'))(req, res);
});
