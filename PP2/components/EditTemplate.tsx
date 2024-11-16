import { useState, useEffect } from 'react';
import axios from 'axios';
import { Template } from '@/interface/Template';

interface EditTemplateProps {
    template: Template;
    handleSaveTemplate: (data: { title: string; tags: string[]; tagsDelete: string[], explanation: string }) => void;
    setIsEditingTemplate: (isEditing: boolean) => void;
}

const EditTemplate = ({ template, handleSaveTemplate, setIsEditingTemplate }: EditTemplateProps) => {
    const [title, setTitle] = useState(template.title);
    const [tags, setTags] = useState(template.tags.map((tag) => tag.tag));
    const [newTag, setNewTag] = useState('');
    const [tagsDelete, setTagsDelete] = useState<string[]>([]);
    const [explanation, setExplanation] = useState(template.explanation);
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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

    // Save handler
    const saveTemplate = () => {
        handleSaveTemplate({
            title,
            tags,
            tagsDelete,
            explanation,
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

    // Cancel Edit: Revert tags to the original state
    const cancelEdit = () => {
        setTags(template.tags.map((tag) => tag.tag)); // Revert to the initial tags
        setTagsDelete([]); // Clear delete tracking
        setNewTag(''); // Clear new tag input
        setExplanation(template.explanation); // Revert explanation
        setIsEditingTemplate(false); // Exit edit mode
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Template</h3>
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full focus:outline-none"
                    onClick={cancelEdit}
                    aria-label="Close Edit Template"
                    title="Close Edit Template"
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
                    placeholder="Edit template title"
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
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Edit template explanation"
                />
            </div>

            <button
                className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                onClick={saveTemplate}
            >
                Save Changes
            </button>
        </div>
    );
};

export default EditTemplate;
