import { DataObject } from '../utils/generic-types';


export interface CallableResponse<T = DataObject> {
  result?: T;
  message?: string;
  success: boolean;
}
