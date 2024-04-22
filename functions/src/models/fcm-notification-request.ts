import { DataObject } from '../utils/generic-types';

export interface FcmNotificationRequest {
  userId: string;
  title: string;
  body: string;
  fcmTokenId: string;
  type: CallType;
  data?: DataObject;
}

enum CallType {
  AUDIO = 'audio',
  VIDEO = 'video'
}
