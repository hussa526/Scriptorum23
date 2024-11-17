import { Tag } from './Tag';
import { Template } from './Template';
import { Vote } from './Vote';
import { User } from './User';

export interface Blogpost {
    id: number;
    title: string;
    content: string;
    tags: Tag[];
    templates: Template[];
    votes: Vote[];
    user: User;
}