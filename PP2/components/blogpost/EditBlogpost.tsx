import { useState, useEffect } from 'react';
import axios from 'axios';
import { Blogpost } from '@/interface/Blogpost';
import { Template } from '@/interface/Template';

interface EditBlogpostProps {
    blogpost: Blogpost;
    handleSaveBlogpost: (data: { title: string; tags: string[]; tagsDelete: string[], content: string, templates: Template[], templatesDelete: Template[] }) => void;
    setIsEditingBlogpost: (isEditing: boolean) => void;
    handleCancelEdit: () => void;
}

const EditTemplate = ({ blogpost: blogpost, handleSaveBlogpost: handleSaveBlogpost, setIsEditingBlogpost: setIsEditingBlogpost, handleCancelEdit:handleCancelEdit}: EditBlogpostProps) => {
    const [title, setTitle] = useState(blogpost.title);
    const [content, setContent] = useState(blogpost.content);

    const [tags, setTags] = useState(blogpost.tags.map((tag) => tag.tag));
    const [newTag, setNewTag] = useState('');
    const [tagsDelete, setTagsDelete] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [templates, setTemplates] = useState(blogpost.templates.map((template) => template));
    const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
    const [templatesDelete, setTemplatesDelete] = useState<Template[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchField, setSearchField] = useState<"title" | "tags" | "codeContent">("title");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalTemplates, setTotalTemplates] = useState(0);

    // Debounce search query to limit the number of API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            if (newTag.length > 0) {
                searchTags(newTag);
            } else {
                setSearchResults([]); // Clear results when input is empty
            }
        }, 200); // Debounce delay

        return () => clearTimeout(timer); // Cleanup the timer on component unmount or new input
    }, [newTag]);

    // Fetch matching tags from the backend
    const searchTags = async (query: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/tags/search?query=${query}`);
            setSearchResults(response.data.map((tag: any) => tag.tag)); // Assuming response contains a list of tags
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    // Save handler
    const saveBlogpost = () => {
        handleSaveBlogpost({
            title,
            tags,
            tagsDelete,
            content: content,
            templates,
            templatesDelete,
        });
    };

    // Add a new tag to the list
    const addTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setNewTag(''); // Clear input after adding
            setSearchResults([]); // Clear search results after adding the tag
        }
    };

    // Remove tag from the list
    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
        setTagsDelete([...tagsDelete, tag]); // Add to tagsDelete state to track deletions
    };

    const handleTemplateSelection = (templateId: number) => {
        setSelectedTemplates((prevSelectedTemplates) => {
          if (prevSelectedTemplates.includes(templateId)) {
            return prevSelectedTemplates.filter((id) => id !== templateId);
          }
          return [...prevSelectedTemplates, templateId];
        });
      };

    // Cancel Edit: Revert tags to the original state
    const cancelEdit = () => {
        setTags(blogpost.tags.map((tag) => tag.tag)); // Revert to the initial tags
        setTagsDelete([]); // Clear delete tracking
        setNewTag(''); // Clear new tag input
        setTemplates(blogpost.templates);    // Revert to the initial Templates
        setTemplatesDelete([]);     // Clear delete tracking
        setContent(blogpost.content); // Revert content
        setTitle(blogpost.title);       // Revert title
        setIsEditingBlogpost(false); // Exit edit mode
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Blogpost</h3>
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full focus:outline-none"
                    onClick={cancelEdit}
                    aria-label="Close Edit Blogpost"
                    title="Close Edit Blogpost"
                >
                    ⚙️
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Edit blogpost title"
                />
            </div>

            {/* Tags Section */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                
                {/* Display existing tags as blocks */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                        <div key={index} className="flex items-center bg-blue-200 px-3 py-1 rounded-full text-sm text-blue-700">
                            {tag}
                            <button
                                className="ml-2 text-red-500"
                                onClick={() => removeTag(tag)}
                                aria-label={`Remove tag ${tag}`}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                {/* Input for new tag */}
                <div className="flex items-center">
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Enter a new tag"
                    />
                    <button
                        className="ml-2 bg-blue-500 text-white p-2 rounded-full"
                        onClick={() => addTag(newTag)} // Add new tag when clicked
                        aria-label="Add new tag"
                    >
                        +
                    </button>
                </div>

                {/* Display search results */}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <ul className="mt-2">
                        {searchResults.map((tag, index) => (
                            <li
                                key={index}
                                className="cursor-pointer text-blue-600 hover:text-blue-800"
                                onClick={() => addTag(tag)} // Add tag from search result
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explanation
                </label>
                <textarea
                    className="w-full p-2 border rounded-md resize-none"
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Edit template explanation"
                />
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

            <button
                className="w-full mt-2 bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                onClick={saveBlogpost}
            >
                Save Changes
            </button>
        </div>
    );
};

export default EditTemplate;
