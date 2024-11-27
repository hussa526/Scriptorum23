// components/Aside.js

import { useState } from 'react';

import { Template } from "@/interface/Template";
import { Blogpost } from "@/interface/Blogpost";

interface AsideProps {
  blogPosts: Blogpost[];
  forks: Template[];
}

const Aside = ({ blogPosts, forks }: AsideProps) => {
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [visibleForks, setVisibleForks] = useState(3);

  const handleShowMorePosts = () => {
    setVisiblePosts(visiblePosts + 3);
    // onShowMorePosts();
  };

  const handleShowMoreForks = () => {
    setVisibleForks(visibleForks + 3);
    // onShowMoreForks();
  };

  return (
    <aside className="aside-container">
        {/* Blog Posts Section */}
        <div>
        <h2 className="text-xl font-semibold mb-2">Blog Posts</h2>
        <ul className="space-y-2">
            {blogPosts.slice(0, visiblePosts).map((post) => (
            <li key={post.id} className="p-4 bg-white rounded-md shadow-md hover:bg-gray-50 transition duration-200">
                {/* Link to individual blog post */}
                <a href={`/blogpost/${post.id}`} className="block">
                {/* Blog Post Title */}
                <h3 className="font-semibold text-lg">{post.title}</h3>
                {/* Blog Post Excerpt */}
                <p className="mt-2 text-sm text-gray-600">{post.content}</p>
                </a>
            </li>
            ))}
        </ul>
        {blogPosts.length > visiblePosts && (
            <button onClick={handleShowMorePosts} className="mt-4 text-blue-500">Show More</button>
        )}
        </div>

        {/* Forks Section */}
        <div>
        <h2 className="text-xl font-semibold mb-2">Forks</h2>
        <ul className="space-y-2">
            {forks.slice(0, visibleForks).map((fork) => (
            <li key={fork.id} className="p-4 bg-white rounded-md shadow-md hover:bg-gray-50 transition duration-200">
                {/* Link to individual forked template page */}
                <a href={`/template/${fork.id}`} className="block">
                {/* Forked Template Title */}
                <h3 className="font-semibold text-lg">{fork.title} @{fork.id}</h3>

                {/* Forked Template Author */}
                <p className="mt-2 text-sm text-gray-600">
                    By <strong>{fork.user.username}</strong>
                </p>

                {/* Forked Template Tags */}
                <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    {fork.tags.slice(0, 2).map((tag) => (
                    <div
                        key={tag.id}
                        className="bg-gray-500 text-white-800 px-6 py-2 rounded-md text-sm font-semibold shadow-md hover:bg-blue-200 transition-all duration-200 ease-in-out flex items-center justify-center"
                    >
                        {tag.tag}
                    </div>
                    ))}
                    {fork.tags.length > 2 && (
                    <div
                        className="bg-gray-500 text-white-800 px-6 py-2 rounded-md text-sm font-semibold shadow-md hover:bg-blue-200 transition-all duration-200 ease-in-out flex items-center justify-center"
                    >
                        ...
                    </div>
                    )}
                </div>
                </a>
            </li>
            ))}
        </ul>
        {forks.length > visibleForks && (
            <button onClick={handleShowMoreForks} className="mt-4 text-blue-500">Show More</button>
        )}
        </div>
    </aside>
  );
};

export default Aside;
