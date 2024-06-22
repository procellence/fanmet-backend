import { DataObject } from '../utils/generic-types';

export interface FcmNotificationRequest {
  userId: string;
  body: string;
  agoraTokenId: string;
  type: CallType;
  data?: DataObject;
}

enum CallType {
  AUDIO = 'audio',
  VIDEO = 'video'
}
