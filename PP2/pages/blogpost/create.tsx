// pages/create-blogpost.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Template } from '@/interface/Template';
import { Tag } from '@/interface/Tag';

const CreateBlogPost = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [newTag, setNewTag] = useState("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [searchQuery, setSearchQuery] = useState(""); // Track search query for templates
  const [page, setPage] = useState(1); // Track current page for pagination
  const [limit, setLimit] = useState(10); // Set the limit per page
  const [totalTemplates, setTotalTemplates] = useState(0); // Total number of templates for pagination

  useEffect(() => {
    // Fetch existing tags from the API
    fetch("/api/tags")
      .then((response) => response.json())
      .then((data) => setAllTags(data))
      .catch((err) => console.error("Error fetching tags:", err));

    // Check if the user is logged in (e.g., by checking a token in localStorage or sessionStorage)
    const userToken = localStorage.getItem("userToken"); // Example check, adjust as needed
    setIsLoggedIn(!!userToken);
  }, []);

  useEffect(() => {
    // Fetch templates from the API with pagination and search query
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`/api/template?page=${page}&limit=${limit}&codeContent=${searchQuery}`);
        const data = await response.json();
        setTemplates(data.templates);
        setTotalTemplates(data.totalCount); // Assume the response includes the total number of templates
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    };

    fetchTemplates();
  }, [page, limit, searchQuery]); // Refetch templates when page, limit, or searchQuery changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBlogPost = {
      title,
      content,
      tagsId: selectedTags,
      templatesId: selectedTemplates,
    };

    try {

    // Retrieve the user token from localStorage
    const userToken = localStorage.getItem("userToken");

    // Construct the headers, including the Authorization token
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`, // Add the token in the Authorization header
      };
  
      // Make the request to create the blog post
      const response = await fetch("/api/blogpost/create", {
        method: "POST",
        headers: headers,  // Include headers here
        body: JSON.stringify(newBlogPost),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("You need to be logged in to create a blog post.");
          return;
        }
        throw new Error("Failed to create blog post");
      }

      const result = await response.json();
      router.push(`/blogpost/${result.id}`); // Redirect to the new blog post
    } catch (err: any) {
      setError("Error creating blog post. Please try again.");
      console.error(err);
    }
  };

  const handleTagSelection = (tagId: number) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tagId)) {
        return prevSelectedTags.filter((id) => id !== tagId);
      }
      return [...prevSelectedTags, tagId];
    });
  };

  const handleTemplateSelection = (templateId: number) => {
    setSelectedTemplates((prevSelectedTemplates) => {
      if (prevSelectedTemplates.includes(templateId)) {
        return prevSelectedTemplates.filter((id) => id !== templateId);
      }
      return [...prevSelectedTemplates, templateId];
    });
  };

  const handleCreateNewTag = async () => {
    if (newTag.trim()) {
      try {
        const response = await fetch("/api/tags/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tag: newTag }),
        });

        if (!response.ok) {
          throw new Error("Failed to create tag");
        }

        const result = await response.json();
        setAllTags((prevTags) => [...prevTags, result]);
        setNewTag(""); // Clear the input field after creating the tag
      } catch (err) {
        console.error("Error creating tag", err);
      }
    }
  };

  const handleLoginRedirect = () => {
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!isLoggedIn && (
        <div className="mb-4">
          <p className="text-red-500">You must be logged in to create a blog post.</p>
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Log In
          </button>
        </div>
      )}

      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-semibold text-sm text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block font-semibold text-sm text-gray-700">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-sm text-gray-700">Tags</label>
            <div className="space-y-2">
              {allTags.map((tag) => (
                <div key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagSelection(tag.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`tag-${tag.id}`} className="text-sm text-gray-600">{tag.tag}</label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label htmlFor="new-tag" className="block font-semibold text-sm text-gray-700">Create New Tag</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="new-tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="mt-1 p-2 border rounded-md"
                  placeholder="New Tag"
                />
                <button
                  type="button"
                  onClick={handleCreateNewTag}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-sm text-gray-700">Templates</label>

            {/* Search for templates */}
            <input
              type="text"
              placeholder="Search templates"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-2 p-2 border rounded-md w-full"
            />

            <div className="space-y-2 mt-4">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`template-${template.id}`}
                    checked={selectedTemplates.includes(template.id)}
                    onChange={() => handleTemplateSelection(template.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`template-${template.id}`} className="text-sm text-gray-600">{template.title}</label>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.ceil(totalTemplates / limit)}
              </span>
              <button
                onClick={() => setPage(Math.min(Math.ceil(totalTemplates / limit), page + 1))}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Next
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Create Blog Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateBlogPost;
