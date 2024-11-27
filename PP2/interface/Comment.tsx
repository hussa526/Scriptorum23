import { User } from './User';
import { Vote } from './Vote';

export interface Comment {
    id: number;
    text: String;
    user: User;
    votes: Vote[];
    replies: Comment[];
    isHidden: boolean;
    parent?: Comment | null;
}