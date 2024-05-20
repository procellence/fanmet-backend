import { Post } from '../post';

export interface FetchPostsRequest {
  postId?: string;
  userId?: string;
}

export interface AddPostRequest extends Omit<Post, 'id'> {
}

export interface DeletePostRequest {
  id: string;
}

export interface UpdatePostRequest extends Partial<Post> {
}
