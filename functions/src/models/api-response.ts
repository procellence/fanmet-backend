import { ZodIssue } from 'zod';
import { DataObject } from '../utils/generic-types';


export interface ApiResponse<T = DataObject> {
  result?: T;
  message?: string;
  success: boolean;
  issues?: ZodIssue[];
}
