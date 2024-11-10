import { User } from './User';
import { Blogpost } from './Blogpost';

export interface Vote {
    id: number;
    user: User;
    type: boolean;
    blogpost?: Blogpost | null;
    comment?: Comment | null;
}