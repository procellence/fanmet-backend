import { User } from '../user';

export interface AddUserRequest extends Omit<User, 'id'> {
}

export interface UpdateUserRequest extends Partial<User> {
}

export interface FetchUserRequest {
  email?: string;
  id?: string;
}

export interface RecommendUserRequest extends User {
}

