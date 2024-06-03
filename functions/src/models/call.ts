import { ModelBase } from '../utils/model-base';
import { User } from './user';

export interface Call extends ModelBase {
  type: CallType;
  fromUserId: string;
  toUserId: string;
  callDurationTime: number;
  fromUser?: User;
  toUser?: User;
}

enum CallType {
  AUDIO = 'audio',
  VIDEO = 'video'
}
