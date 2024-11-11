import { Tag } from './Tag';
import { User } from './User';
import { Blogpost } from './Blogpost';

export interface Template {
    id: number;
    title: string;
    explanation: string;
    code: string;
    tags: Tag[];
    user: User;
    extension: string;
    blogposts: Blogpost[];
    userId: number;
    isForked: boolean;
    forkedId: number;
    forks: Template[];
}