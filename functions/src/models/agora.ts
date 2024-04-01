export enum AgoraRtcRole {
  PUBLISHER = 'publisher',
  SUBSCRIBER = 'subscriber',
}

export interface AgoraTokenRequest {
  channelName: string;
  role: AgoraRtcRole;
  keepAliveInSeconds?: string;
}
