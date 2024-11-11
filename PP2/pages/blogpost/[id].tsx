// Code generated using ChatGPT

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Blogpost } from '@/interface/Blogpost'; // Import Blogpost interface
import { Template } from '@/interface/Template'; // Import Template interface
import { Tag } from '@/interface/Tag'; // Import Tag interface
import { User } from '@/interface/User';
import TemplateComponent from '@/components/TemplateComponent'; // Import TemplateComponent

const BlogPostPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [blogPost, setBlogPost] = useState<Blogpost | null>(null); // State to store blog post data
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (!id) return; // Do not fetch if `id` is undefined

    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blogpost/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        const data = await response.json();
        setBlogPost(data);  // Set blog post data
        console.log(data);
      } catch (err) {
        setError("Error fetching blog post.");
        console.error(err);
      }
    };

    fetchBlogPost();
  }, [id]);  // Re-fetch when `id` changes

  if (error) return <div className="error">{error}</div>;  // Display error if exists
  if (!blogPost) return <div>Loading...</div>;  // Show loading message while fetching data

  return (
    <div className="mt-16 max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{blogPost.title}</h1>
      <p className="text-gray-400">Author: {blogPost.user.username}</p> 
      <p className="text-gray-600">{blogPost.content}</p>

      {/* Render Tags */}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Tags:</h3>
        <ul className="list-disc pl-5">
            {blogPost.tags.map((tag) => (
                <li key={tag.id}>{tag.tag}</li>
            ))}
        </ul>
      </div>

      {/* Render Templates using TemplateComponent */}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Templates:</h3>
        <div className="space-y-2">
            {blogPost.templates.map((template) => (
                <TemplateComponent key={template.id} template={template} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
