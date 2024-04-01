import { RtcRole, RtcTokenBuilder } from 'agora-token';
import { https } from 'firebase-functions/v2';
import { Service } from 'typedi';
import { APP_CERTIFICATE, APP_ID } from '../../constants';
import { AgoraRtcRole, AgoraTokenRequest } from '../../models/agora';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';

const HttpsError = https.HttpsError;

@Service()
export default class AgoraTokenGeneratorFunction {

  private readonly UID = 0;

  async main(req: CallableRequest<AgoraTokenRequest>) {

    const { channelName, role, keepAliveInSeconds } = req.data;

    const keepAlive = keepAliveInSeconds ? parseInt(keepAliveInSeconds) : 60 * 60;

    if (!channelName) {
      throw new HttpsError('not-found', 'Channel name is required');
    }

    if (!role) {
      throw new HttpsError('not-found', 'Role is required');
    }

    let rtcRole: number;
    try {
      rtcRole = this.getRtcRole(role);
    } catch (e: any) {
      throw new HttpsError('invalid-argument', e.message);
    }

    await this.generateAccessToken(channelName, rtcRole, keepAlive);
  }

  async generateAccessToken(channelName: string, role: number, expireTimeInSeconds: number) {
    return RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, this.UID, role, expireTimeInSeconds, expireTimeInSeconds);
  }

  private getRtcRole(role: AgoraRtcRole): number {
    switch (role) {
      case AgoraRtcRole.PUBLISHER:
        return RtcRole.PUBLISHER;
      case AgoraRtcRole.SUBSCRIBER:
        return RtcRole.SUBSCRIBER;
      default:
        throw new Error(`Invalid role ${role}, supported roles are ${AgoraRtcRole.PUBLISHER} and ${AgoraRtcRole.SUBSCRIBER}`);
    }
  }
}
