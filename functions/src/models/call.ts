import { ModelBase } from '../utils/model-base';
import { User } from './user';

export interface Call extends ModelBase {
  type: CallType;
  requestType: CallRequestType;
  fromUserId: string;
  toUserId: string;
  callDurationTime: number;
  fromUser?: User;
  toUser?: User;
}

export enum CallRequestType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing'
}

enum CallType {
  AUDIO = 'audio',
  VIDEO = 'video'
}
