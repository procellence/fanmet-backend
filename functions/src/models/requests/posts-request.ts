import { Post } from '../post';

export interface FetchPostByUserIdRequest {
  userId: string;
}

export interface AddNewPostRequest extends Omit<Post, 'id'> {
}

export interface DeletePostByUserIdRequest {
  id: string;
}

export interface UpdatePostByUserIdRequest extends Partial<Post> {
}
