import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { https } from 'firebase-functions/v2';
import { FcmNotificationRequest } from '../../models/fcm-notification-request';
import admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { CallableRequest } from 'firebase-functions/v2/https';
import { UsersDao } from '../../dao/users.dao';

const HttpsError = https.HttpsError;

export const FIREBASE_PROJECT_ID = process.env.GCLOUD_PROJECT;


admin.initializeApp({
  projectId: FIREBASE_PROJECT_ID,
  credential: admin.credential.applicationDefault(),
});

@Service()
export default class SendFcmNotificationFunction {

  private readonly logger = LoggerService.getLogger(this);

  constructor(
    private usersDao: UsersDao,
  ) {
  }

  async main(req: CallableRequest<FcmNotificationRequest>): Promise<boolean> {
    const fcmNotificationRequest = req.data;
    this.logger.info('Request received', fcmNotificationRequest);

    this.validateRequest(fcmNotificationRequest);

    await this.sendNotification(fcmNotificationRequest);
    return true;
  }

  private validateRequest(request: FcmNotificationRequest): void {
    // TODO: (akshoy) Use ZOD for validation.
    if (!request.agoraTokenId) {
      throw new HttpsError('not-found', 'FCM Token is required');
    }

    if (!request.body) {
      throw new HttpsError('not-found', 'Body is required');
    }
  }

  private async sendNotification(request: FcmNotificationRequest): Promise<void> {

    const userDetail = await this.usersDao.getById(request.userId);

    const dataSend = { 'agoraToken': request.agoraTokenId, 'type': request.type };

    const payload: Message = {
      notification: {
        title: userDetail.firstName + ' ' + userDetail.lastName + '.' + 'fanmet',
        body: request.body,
      },
      token: userDetail.fcmTokenId,
      data: dataSend,
      android: {
        notification: {
          sound: 'default',
          channelId: '564654644',
        },
      },
    };
    this.logger.info('project id', FIREBASE_PROJECT_ID);

    const app = admin.app();
    const messaging = admin.messaging(app);
    const result = await messaging.send(payload);

    this.logger.info('Notification sent successfully', result);
  }
}
