/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import admin from 'firebase-admin';

// project id for firebase usually automatically populated by env
// but in tests this variable changed to 'not-a-project' and
// should be explicitly overridden in initializeApp
// see setupJest.ts file
export const FIREBASE_PROJECT_ID = process.env.GCLOUD_PROJECT;
export const FIREBASE_TEST_PROJECT_ID = 'not-a-project';

export const DEFAULT_BUCKET = `${FIREBASE_PROJECT_ID}.appspot.com`;

admin.initializeApp({
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
});

export const app = admin.app();
