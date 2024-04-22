import { Service } from 'typedi';
import { LoggerService } from '../../services/logger.service';
import { https } from 'firebase-functions/v2';
import { FcmNotificationRequest } from '../../models/fcm-notification-request';
import admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';

const HttpsError = https.HttpsError;

export const FIREBASE_PROJECT_ID = process.env.GCLOUD_PROJECT;


admin.initializeApp({
  projectId: FIREBASE_PROJECT_ID,
  credential: admin.credential.applicationDefault(),
});

@Service()
export default class SendFcmNotificationFunction {

  private readonly logger = LoggerService.getLogger(this);

  async main(req: Request, res: Response) {

    const fcmNotificationRequest = req.body as FcmNotificationRequest;

    this.logger.info('Request received', fcmNotificationRequest);

    this.validateRequest(fcmNotificationRequest);

    await this.sendNotification(fcmNotificationRequest);

    res.status(200).send('FCM Notification sent successfully');

  }

  private validateRequest(request: FcmNotificationRequest): void {
    // TODO: (akshoy) Use ZOD for validation.
    if (!request.fcmTokenId) {
      throw new HttpsError('not-found', 'FCM Token is required');
    }

    if (!request.title) {
      throw new HttpsError('not-found', 'Title is required');
    }

    if (!request.body) {
      throw new HttpsError('not-found', 'Body is required');
    }
  }

  private async sendNotification(request: FcmNotificationRequest): Promise<void> {

    const payload: Message = {
      notification: {
        title: request.title,
        body: request.body,
      },
      token: request.fcmTokenId,
      // data: JSON.stringify(request.data),
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
