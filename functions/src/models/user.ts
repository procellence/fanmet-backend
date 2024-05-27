import { ModelBase } from '../utils/model-base';

export interface User extends ModelBase {
  firstName: string;
  lastName: string;
  email: string;
  likes: string[];
  goodAt: string[];
  audioCallRate: number;
  videoCallRate: number;
  following: number;
  followers: number;
  dateOfBirth: string;
  quote: string;
  balance: number;
  gender: GENDER_TYPE;
  pictureUrl: string
}


enum GENDER_TYPE {
  MALE = 'male',
  FEMALE = 'female',
  TRANSGENDER = 'transgender',
  OTHERS = 'others'
}
