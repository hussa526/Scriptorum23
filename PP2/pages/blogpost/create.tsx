// pages/create-blogpost.tsx

// Created using ChatGPT by Anna Myllyniemi

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Template } from '@/interface/Template';
import { Tag } from '@/interface/Tag';

const CreateBlogPost = () => {
  const router = useRouter();

  // Blog post states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Tags
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Store tag names
  const [newTag, setNewTag] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Templates
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"title" | "tags" | "codeContent">("title");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTemplates, setTotalTemplates] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


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
    const timer = setTimeout(() => {
      if (newTag.length > 0) {
        searchTags(newTag);
      } else {
        setSearchResults([]); // Clear results when input is empty
      }
    }, 200);
  
    return () => clearTimeout(timer);
  }, [newTag]);
  

  useEffect(() => {
    // Fetch templates from the API with pagination and search query
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          `/api/template?page=${page}&limit=${limit}&${searchField}=${searchQuery}`
        );
        const data = await response.json();
        setTemplates(data.templates);
        setTotalTemplates(data.totalCount); // Assume the API includes the total count
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
      tags: selectedTags.join(', '), // Pass tags as a comma-separated string
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


  const searchTags = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tags/search?query=${query}`);
      const data = await response.json();
      setSearchResults(data.map((tag: Tag) => tag.tag)); // Map to tag names
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setNewTag("");
      setSearchResults([]);
    }
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md m-8 mt-24">
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
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag, index) => (
                <div key={index} className="flex items-center bg-blue-200 px-3 py-1 rounded-full text-sm text-blue-700">
                  {tag}
                  <button className="ml-2 text-red-500" onClick={() => removeTag(tag)}>
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Search or create a new tag"
              />
              <button
                className="ml-2 bg-blue-500 text-white p-2 rounded-full"
                type="button"
                onClick={() => addTag(newTag)}
              >
                +
              </button>
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <ul className="mt-2">
                {searchResults.map((tag, index) => (
                  <li
                    key={index}
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div>
            <label className="block font-semibold text-sm text-gray-700">Templates</label>

            {/* Search for templates */}
            <div className="flex space-x-2 items-center mt-4">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value as "title" | "tags" | "codeContent")}
                className="p-2 border rounded-md"
              >
                <option value="title">Title</option>
                <option value="tags">Tags</option>
                <option value="codeContent">Code Content</option>
              </select>
              <input
                type="text"
                placeholder={`Search by ${searchField}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded-md w-full"
              />
            </div>

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
                  <label htmlFor={`template-${template.id}`} className="text-sm text-gray-600">
                    <span className="font-semibold">{template.title}</span> 
                    {template.user.username && (
                      <span className="ml-2 text-gray-500">(by {template.user.username})</span>
                    )}
                  </label>
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
