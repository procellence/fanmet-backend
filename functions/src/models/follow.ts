import { ModelBase } from '../utils/model-base';

export interface Follow extends ModelBase {
  id?: string;
  followingId: string;
  followersId: string;
}
