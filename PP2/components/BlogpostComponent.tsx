import React from 'react';

import { Blogpost } from '@/interface/Blogpost';

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
