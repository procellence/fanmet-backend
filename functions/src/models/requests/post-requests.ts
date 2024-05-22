import { Post } from '../post';

export interface FetchPostsRequest {
  postId?: string;
  userId?: string;
}

export interface AddPostRequest extends Pick<Post, 'userId' | 'imageUrl' | 'text' | 'createdAt' | 'updatedAt' | 'likes'> {
}

export interface DeletePostRequest {
  id: string;
}

export interface UpdatePostRequest extends Partial<Post> {
}
