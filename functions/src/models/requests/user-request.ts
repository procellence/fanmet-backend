import { User } from '../user';

export interface AddUserRequest extends Omit<User, 'id'> {
}

export interface UpdateUserRequest extends Partial<User> {
}

export interface FetchUserByEmailRequest {
  email: string;
}

export interface FetchAllUserRequest extends User {
}

