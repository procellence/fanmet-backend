import { DataObject } from '../utils/generic-types';
import { User } from './user';

export interface FcmNotificationRequest {
  toUserId: string;
  fromUser: User;
  agoraTokenId: string;
  type: CallType;
  data?: DataObject;
}

enum CallType {
  AUDIO = 'audio',
  VIDEO = 'video'
}
