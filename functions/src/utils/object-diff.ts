import { detailedDiff } from 'deep-object-diff';
import { DataObject } from './generic-types';
import { isBlankValue } from './helpers';

export interface DetailedObjectDiff<T extends { [key: string]: any }> {
  added: Partial<T>;
  deleted: Partial<T>;
  updated: Partial<T>;
}

export function objectsDetailedDiff<T extends DataObject>(obj1: Partial<T>, obj2: Partial<T>, skipEmptyValues = false): DetailedObjectDiff<T> {
  if (skipEmptyValues) {
    for (const key of Object.keys(obj2)) {
      if (isBlankValue(obj2?.[key]) && isBlankValue(obj1?.[key])) {
        delete obj2?.[key];
        delete obj1?.[key];
      }
    }
  }
  return detailedDiff(obj1, obj2) as DetailedObjectDiff<T>;
}

export function objectChangedKeys<T extends DataObject>(obj1: Partial<T>, obj2: Partial<T>): (keyof T)[] {
  const diff = objectsDetailedDiff<T>(obj1, obj2);
  return objectChangedKeysFromDiff<T>(diff);
}

export function objectChangedKeysFromDiff<T extends DataObject>(diff: DetailedObjectDiff<T>): (keyof T)[] {
  return Object.keys({
    ...diff.deleted,
    ...diff.added,
    ...diff.updated,
  }) as (keyof T)[];
}
