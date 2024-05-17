export interface Call {
  id?: string;
  type: CallType;
  fromUserId: string;
  toUserId: string;
  callDurationTime: number;
  callStartedAt: string;
  updatedAt: string;
}

enum CallType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO'
}
