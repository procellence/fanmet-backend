import { ModelBase } from '../utils/model-base';

export interface User extends ModelBase {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  likes: string[];
  goodAt: string[];
  profileImageUrl: string;
  quote: string;
  phone: string;
  lastLocation: string;
  audioCallRate: number;
  videoCallRate: number;
  lastLoginAt: string;
  following: number;
  followers: number;
  gender: string;
  balance: number;
  isOnline: boolean;
}
