import {
  CanonicalErrorCodeName,
} from 'firebase-functions/lib/common/providers/https';

interface DbErrorWireFormat {
  details?: unknown;
  message: string;
  status: CanonicalErrorCodeName;
}

export class PgDbError extends Error {
  /**
   * A standard error code that will be returned to the client. This also
   * determines the HTTP status code of the response, as defined in code.proto.
   */
  /**
   * Extra data to be converted to JSON and included in the error response.
   */
  readonly details: unknown;
  constructor(message: string, details?: unknown) {
    super(message);
    this.details = details;
  }
  /**
   * Returns a JSON-serializable representation of this object.
   */
  toJSON() {
    return {
      message: this.message,
      details: this.details,
    } as DbErrorWireFormat;
  }
}

export const VALIDATION_ERROR_MSG = 'Validation error';
export class ValidationExtendError extends Error {
  public readonly message: string = VALIDATION_ERROR_MSG;
  public readonly status = 400;

  constructor(public readonly meta?: Record<string, any>) {
    super();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      error: this.meta,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}
