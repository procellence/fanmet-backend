import { DateTime } from 'luxon';
import { lookup as zipcodeLookup } from 'zipcode-to-timezone';
import { DataObject } from './generic-types';

export function resolveObjectValue<T = string>(obj: {
  [key: string]: any
}, path: string | string[], separator = '.'): T {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev: any, curr: string) => prev && prev[curr], obj);
}

export function changeObjectValue(baseObj: {
  [key: string]: any
}, path: string | string[], value: any, separator = '.'): void {
  if (typeof path === 'string') {
    path = path.split(separator);
  }

  let currentObj = baseObj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!currentObj[key] || typeof currentObj[key] !== 'object') {
      currentObj[key] = {};
    }
    currentObj = currentObj[key];
  }

  currentObj[path[path.length - 1]] = value;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function makeChunks<T>(array: T[], size: number): T[][] {
  const out: T[][] = [];
  let index = 0;
  while (index < array.length) {
    out.push(array.slice(index, size + index));
    index += size;
  }
  return out;
}

export function copyObject<T = DataObject>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function flatObject(input: DataObject): DataObject {
  function flat(res: DataObject, key: string, val: any, pre = ''): DataObject {
    const prefix = [pre, key].filter(v => v).join('.');
    return typeof val === 'object' && val !== null
      ? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
      : Object.assign(res, { [prefix]: val });
  }

  return Object.keys(input).reduce((prev, curr) => flat(prev, curr, input[curr]), {});
}

export function isBlankValue(value: any) {
  return (typeof value === 'string' && value.trim().length === 0) || value === null || value === undefined;
}


export function normalizeDateString(date: string, format?: string): string | null {
  if (!date) {
    return null;
  }
  const result = format ? DateTime.fromFormat(date, format, { zone: 'utc' }) : DateTime.fromJSDate(new Date(date), { zone: 'utc' });
  return result.isValid ? result.toISODate() : null;
}

export function mergeArraysOfObjectsByProperty(target: any[], source: any[], prop: string) {
  const targetObject = {} as any;

  // Initialize targetObject with objects from the target array
  for (const obj of target) {
    targetObject[obj[prop]] = obj;
  }

  // Merge objects from the source array into the targetObject
  for (const sourceElement of source) {
    const key = sourceElement[prop];
    targetObject[key] ? Object.assign(targetObject[key], sourceElement) : target.push(sourceElement);
  }
}

export function getTimezoneByZipcode(zipcode: string): string {
  return zipcodeLookup(zipcode);
}

// TODO: Use standard library to check this
export function isNotEmpty(input: any): boolean {

  // Check if array exists and it is not empty
  const isArray: boolean = Array.isArray(input);

  if (isArray && input.length) {
    return true;

    // Check if string or number exists
  } else if (!isArray && input && !Number.isNaN(input)) {
    return true;
  }

  return false;
}

export function isEmpty(input: any): boolean {
  return !isNotEmpty(input);
}

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}

export function isNumber(value: any): boolean {
  return (value instanceof Number) || (typeof value === 'number' && isFinite(value));
}

export function convertToNumber(value: string | number): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  const num = isString(value) && value ? Number(value) : null;
  return isNaN(num) ? null : num;
}

export function parseDateStringToDateTime(dateString: string): DateTime {
  const parsers = [
    (val: string) => DateTime.fromJSDate(new Date(val)),
    DateTime.fromSQL,
    DateTime.fromISO,
  ];

  for (const parse of parsers) {
    const result = parse(dateString);
    if (result.isValid) {
      return result;
    }
  }
  return null;
}

export function getOrganizationQueueName(queueName: string, organizationId: string): string {
  return `${queueName}-${organizationId.replace(/_/g, '-')}`;
}
