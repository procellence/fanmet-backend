import { isEqual, isObject, transform } from 'lodash';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { Stream } from 'stream';
import { ValidationExtendError } from './errors';
import { Item } from '../models/item';

export function objectDiff(object: { [key: string]: any }, base: { [key: string]: any }): { [key: string]: any } {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key]) && (value || base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? objectDiff(value, base[key]) : value;
    }
  });
}

export function getUniqueKeysFromSecondObject(obj1: { [id: string]: object }, obj2: {
  [id: string]: object
}): string[] {
  return Object.keys(obj2).filter((key) => !obj1[key]);
}

/**
 * Extract validation message
 * @param errors
 * @param path
 */
export function extractValidationMessage(
  errors: ValidationError[],
  path = '',
): {
  [key: string]: {
    [key: string]: string
  }
}[] {
  let stack: any = [];
  while (errors.length) {
    const item = errors.pop();
    const key = path ? `${path}.${item?.property}` : `${item?.property}`;

    if (item && !item.children?.length && item?.constraints) {
      stack.push({ [key]: item.constraints });
    }

    if (item && item.children?.length) {
      const res: any = extractValidationMessage(item.children, key);
      stack = stack.concat(res);
    }
  }
  return stack;
}

/**
 * Validate data
 * @param data
 */
export async function runTransformValidation(data: any): Promise<void> {
  const error = await validate(data, {
    skipMissingProperties: true,
    skipUndefinedProperties: true,
    enableDebugMessages: true,
  });
  if (error.length) {
    const msg = extractValidationMessage(error);
    throw new ValidationExtendError(msg);
  }
}

/**
 * Transform payload to class and validate
 * @param classModel
 * @param payload
 */
export async function transformToClassAndValidate<T, V>(
  classModel: T extends ClassConstructor<T> ? T : ClassConstructor<T>,
  payload: V,
): Promise<T> {
  const data: T = plainToInstance<T, V>(
    classModel,
    payload,
    { exposeUnsetFields: false, excludeExtraneousValues: true },
  );
  await runTransformValidation(data);
  return data as T;
}

/**
 * Transform payload to class
 * @param classModel
 * @param payload
 */
export async function transformToClass<T, V>(
  classModel: T extends ClassConstructor<T> ? T : ClassConstructor<T>,
  payload: V,
): Promise<T> {
  const data: T = plainToInstance<T, V>(
    classModel,
    payload,
    { exposeUnsetFields: false, excludeExtraneousValues: true },
  );
  return data as T;
}


export function convertNumberToInternationalFormat(phone: string): string {
  if (!phone) {
    return null;
  }
  // Remove non-numeric characters
  const cleanedPhone = phone.replace(/\D/g, '');

  // If the number already has '+' prefix, return cleaned number
  if (phone.startsWith('+')) {
    return '+' + cleanedPhone;
  }

  // If length is 10 digits, assume it's a US number and prefix with '+1'
  if (cleanedPhone.length === 10) {
    return '+1' + cleanedPhone;
  }

  if (cleanedPhone.length === 11 && cleanedPhone.startsWith('1')) {
    return '+' + cleanedPhone;
  }

  // For other lengths without a specific rule, return the cleaned number as is
  return cleanedPhone;
}

// Format the given date to MM/DD/YYYY format
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return month + '/' + day + '/' + year;
}

/**
 * Replace characters in a string.
 * Example input - abcdefghij, start - 2, end - 3, substitute - xy.
 * result - axydefghij
 * @param input - input strings
 * @param start - character insert start position
 * @param end - character insert end position
 * @param substitute - character replaced by
 */
export function replaceRange(input: string, start: number, end: number, substitute: string) {
  return input.substring(0, (start - 1)) + substitute + input.substring(end);
}

export async function streamToBuffer(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const buf = Array<any>();
    stream.on('data', (chunk) => buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(buf)));
    stream.on('error', (err) => reject(`error converting stream - ${err}`));
  });
}

export function sortDate(a: Item, b: Item): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}
