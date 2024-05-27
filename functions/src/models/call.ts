import { ModelBase } from '../utils/model-base';

export interface Call extends ModelBase {
  type: CallType;
  fromUserId: string;
  toUserId: string;
  callDurationTime: number;
}

enum CallType {
  AUDIO = 'audio',
  VIDEO = 'video'
}
