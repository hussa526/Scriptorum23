import React, { useState } from 'react';
import { Blogpost } from '@/interface/Blogpost'; // Import Blogpost interface

interface BlogpostContentProps {
  title: string;
  content: string;
  authorName: string;
  tags: string[];
  onEdit: () => void; // Callback function to switch to edit mode
}

const BlogpostContent: React.FC<BlogpostContentProps> = ({ title, content, authorName, tags, onEdit }) => {
  return (
    <div className="blogpost-content p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">By <strong>{authorName}</strong></p>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>

      <div
        className="content-prose text-gray-800 mb-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="tags mb-4">
        <strong>Tags: </strong>
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm mr-2">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogpostContent;
