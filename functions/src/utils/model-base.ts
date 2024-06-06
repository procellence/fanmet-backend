import { DateTime } from 'luxon';

export interface ModelBase<K = string> {
  id?: K;
  createdAt?: string;
  updatedAt?: string;
}

export const modelBaseFields: string[] = ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];

export function copyModel<T extends ModelBase>(source: T, params: {
  author?: string,
  isCreate?: boolean,
  isUpdate?: boolean,
  isIdIncluded?: boolean,
  extra?: Partial<T>,
} = { isIdIncluded: false }): T {
  const target: T = {
    ...source,
    ...(params.extra ? params.extra : {}),
  };
  if (!params.isIdIncluded) {
    delete target.id;
  }
  if (params.isUpdate || params.isCreate) {
    target.updatedAt = DateTime.now().toISO();
    if (params.author) {
      // target.updatedBy = params.author;
    }
    if (params.isCreate) {
      target.createdAt = target.updatedAt;
      if (params.author) {
        // target.createdBy = params.author;
      }
    }
  }
  return target;
}
