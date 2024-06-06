import { ModelBase } from '../utils/model-base';
import { User } from './user';

export interface Post extends ModelBase {
  userId: string;
  videoUrl?: string;
  imageUrl?: string;
  text: string;
  likes: number;
  user?: User;
}
