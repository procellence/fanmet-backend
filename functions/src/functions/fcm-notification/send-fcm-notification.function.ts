import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { https } from 'firebase-functions/v2';
import { FcmNotificationRequest } from '../../models/fcm-notification-request';
import admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { CallableRequest } from 'firebase-functions/v2/https';
import { UsersDao } from '../../dao/users.dao';
import { capitalize } from 'lodash';
import { CallsDao } from '../../dao/calls.dao';
import { FcmPayload } from '../../models/fcm-data-send';
import { DataObject } from '../../utils/generic-types';

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
    private callsDao: CallsDao,
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

    if (!request.fromUser) {
      throw new HttpsError('not-found', 'From user is required');
    }

    if (!request.toUserId) {
      throw new HttpsError('not-found', 'To user id is required');
    }
  }

  private async sendNotification(request: FcmNotificationRequest): Promise<void> {

    const userDetail = await this.usersDao.getById(request.toUserId);

    // log call activity for this user.
    await this.callsDao.create({
      fromUserId: request.fromUser.id,
      toUserId: request.toUserId,
      type: request.type,
      callDurationTime: 0,
    });

    const dataSend: FcmPayload = {
      agoraToken: request.agoraTokenId,
      type: request.type,
      fromUserProfileUrl: request.fromUser.pictureUrl,
    };

    // get from user full name.
    const fromUserFullName = `${request.fromUser.firstName} ${request.fromUser.lastName}`;

    const payload: Message = {
      notification: {
        title: fromUserFullName,
        body: `${capitalize(request.type)} call`,
      },
      token: userDetail.fcmTokenId,
      data: dataSend as DataObject,
      android: {
        notification: {
          sound: 'default',
        },
      },
    };

    const app = admin.app();
    const messaging = admin.messaging(app);
    const result = await messaging.send(payload);

    this.logger.info('Notification sent successfully', result);
  }
}
