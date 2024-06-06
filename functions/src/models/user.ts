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
  withdrawalOption?: WithdrawalOption;
}

export interface WithdrawalOption {
  type: WITHDRAWAL_TYPE;
  bankWithdrawal?: BankWithdrawal;
  upiWithdrawal?: UpiWithdrawal;
}

export interface BankWithdrawal {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface UpiWithdrawal {
  upiId: string;
}

enum WITHDRAWAL_TYPE {
  BANK = 'bank',
  UPI = 'upi',
}

enum GENDER_TYPE {
  MALE = 'male',
  FEMALE = 'female',
  TRANSGENDER = 'transgender',
  OTHERS = 'others'
}
