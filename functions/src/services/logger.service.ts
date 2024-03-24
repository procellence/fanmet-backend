import { logger } from 'firebase-functions';
import { LoggerContext } from './logger-context';
import { DataObject } from '../utils/generic-types';
import { isString } from '../utils/helpers';

export class LoggerService {
  private constructor(private readonly logTag: string) {
  }

  public static getLogger(klass: any): LoggerService {
    const isString = typeof klass === 'string' || klass instanceof String;
    const logTag = isString ? klass : klass?.constructor?.name ?? 'Unknown';
    return new LoggerService(logTag);
  }

  debug(...args: any[]): void {
    logger.debug(...this.format(args));
  }

  log(...args: any[]): void {
    logger.log(...this.format(args));
  }

  info(...args: any[]): void {
    logger.info(...this.format(args));
  }

  warn(...args: any[]): void {
    logger.warn(...this.format(args));
  }

  /**
   * Error is separated because firestore-functions has next check, which changes log message:
   * ```
   * if (severity === "ERROR" && !args.find((arg) => arg instanceof Error)) {
   *         message = new Error(message).stack || message;
   * }
   * ```
   */
  error(error: Error, ...args: any[]): void {
    logger.error([error, ...this.format(args)]);
  }

  private getAdditionalParams(): DataObject {
    const defaultParams = {
      logTag: this.logTag,
    };

    const paramsMap = LoggerContext.getCopyOfContextMap();
    return { ...defaultParams, ...Object.fromEntries(paramsMap) };
  }

  private format(args: any[]): any[] {
    args = args?.length ? args : [];
    args.push(this.getAdditionalParams());
    const message = args.filter((arg) => isString(arg)).join(' ');
    const jsonPayload = this.getJsonPayload(args);
    let jsonPayloadMessage = jsonPayload.message;
    if (jsonPayloadMessage) {
      jsonPayloadMessage = message ? `${message} ${jsonPayloadMessage}` : jsonPayloadMessage;
      return [jsonPayloadMessage, jsonPayload];
    }
    return [message, jsonPayload];
  }

  private getJsonPayload(args: any[]): DataObject {
    let dataIndex = 0;
    return args
      .filter((arg) => !isString(arg))
      .reduce((acc, arg) => {
        if (Array.isArray(arg)) {
          dataIndex++;
          return { ...acc, ['data' + `${dataIndex === 1 ? '' : dataIndex}`]: arg };
        }
        if (typeof arg === 'object' && arg !== null) {
          return { ...acc, ...arg };
        }
        return acc;
      }, {});
  }
}
