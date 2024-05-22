import { ModelBase } from '../utils/model-base';

export interface Post extends ModelBase {
  userId: string;
  videoUrl?: string;
  imageUrl?: string;
  text: string;
  likes: number;
}
