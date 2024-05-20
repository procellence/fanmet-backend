import { Response } from 'express';
import { sprintf } from 'sprintf-js';
import { ZodError } from 'zod';
import { LoggerService } from '../services/logger.service';
import { Request } from 'firebase-functions/v2/https';
import { ApiResponse } from '../models/api-response';
import { BadRequestError } from '../errors/api-errors';

export abstract class DefaultApiHandler<R> {

  protected readonly logger = LoggerService.getLogger(this);

  private readonly invalidRequestTypeErrorMessage =
    '%s Request is not allowed.';

  private readonly invalidContentTypeErrorMessage =
    'Invalid Content Type found. Expecting content type to be [%s]';

  protected constructor() {
  }

  abstract parseRequest(data: R): R;

  validateRequestMethod(
    req: Request,
    method: 'GET' | 'POST' | 'PUT',
  ): boolean {
    const reqMethod = req.method;
    if (reqMethod === method) {
      return true;
    }

    throw new BadRequestError(
      sprintf(this.invalidRequestTypeErrorMessage, reqMethod),
    );
  }

  validateContentType(
    req: Request,
    contentType: string,
  ): boolean {
    const reqContentType = req.headers['content-type'];

    if (reqContentType && reqContentType.includes(contentType)) {
      return true;
    }

    throw new BadRequestError(
      sprintf(this.invalidContentTypeErrorMessage, contentType),
    );
  }

  protected errorHandling(err: any, res: Response): Response {
    const errorMessage = err.message;
    if (err instanceof ZodError) {
      this.logger.error(new Error(`Input validation failed, error : ${errorMessage}`));
      return res.status(400).json({
        issues: err.issues,
      } as ApiResponse);
    }

    if (err instanceof BadRequestError) {
      this.logger.error(errorMessage);
      return res.status(400).json({
        message: errorMessage,
        success: false,
      } as ApiResponse);
    }

    this.logger.error(new Error(`Error occurred, ${err.stack}`));
    return res.status(500).json({
      message: 'Sorry! We are unable to process your request',
      success: false,
    } as ApiResponse);
  }
}
