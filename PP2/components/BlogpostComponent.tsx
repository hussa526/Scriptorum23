import React from 'react';

interface Tag {
    id: number;
    tag: string;
}

interface Template {
    id: number;
    title: string;
    explanation: string;
    code: string;
    tags: Tag[];
}

interface User {
    id: number;
    username: string;
}

interface Vote {
    id: number;
    user: User;
    type: boolean;
    blogpost?: Blogpost | null;
    comment?: Comment | null;
}

interface Blogpost {
    id: number;
    title: string;
    content: string;
    tags: Tag[];
    templates: Template[];
    votes: Vote[];
}

interface BlogpostComponentProps {
    blogpost: Blogpost;
}

const BlogpostComponent: React.FC<BlogpostComponentProps> = ({ blogpost }) => {
    return (
        <div
            key={blogpost.id}
            className="w-[70%] bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 mb-4 hover:shadow-2xl hover:scale-105 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 ease-in-out transform"
        >
            <h2 className="text-xl font-semibold text-gray-800 text-left">{blogpost.title}</h2>
            <p className="text-gray-600 text-left">{blogpost.content}</p>
        </div>
    );
};

export default BlogpostComponent;
