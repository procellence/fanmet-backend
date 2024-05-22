import { Post } from '../post';

export interface FetchPostsRequest {
  postId?: string;
  userId?: string;
}

export interface AddPostRequest extends Pick<Post, 'userId' | 'imageUrl' | 'text'> {
}

export interface DeletePostRequest {
  id: string;
}

export interface UpdatePostRequest extends Partial<Post> {
}
