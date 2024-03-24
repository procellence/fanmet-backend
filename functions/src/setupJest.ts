import './polyfills';

process.env.GCLOUD_PROJECT = 'not-a-project';
process.env.FIRESTORE_EMULATOR_HOST = '0.0.0.0:8080';
process.env.FIREBASE_EMULATOR_HUB = '0.0.0.0:4400';
