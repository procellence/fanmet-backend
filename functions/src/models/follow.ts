import { ModelBase } from '../utils/model-base';

export interface Follow extends ModelBase {
  id?: string;
  followerId: string;
  followedId: string;
}
