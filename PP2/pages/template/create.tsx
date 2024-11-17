import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import MonacoEditorComponent from '@/components/CodeEditor';

const CreateTemplatePage: React.FC = () => {
    const router = useRouter();
    const { language, code } = router.query; // Get the language and code from query params

    const [templateTitle, setTemplateTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    
    const [newTag, setNewTag] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Ensure language and code are strings
    const [selectedLanguage, setSelectedLanguage] = useState<string>(typeof language === 'string' ? language : '');
    const [templateCode, setTemplateCode] = useState<string>(typeof code === 'string' ? code : '');

    // Set the code and language when the component mounts
    useEffect(() => {
        if (typeof language === 'string') {
            setSelectedLanguage(language);
        }
        if (typeof code === 'string') {
            setTemplateCode(code);
        }
    }, [language, code]);

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
    };

    const handleSaveTemplate = async () => {
        const userToken = localStorage.getItem("userToken");

        // API call to save the template
        const res = await fetch('/api/template/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify({
                title: templateTitle,
                extension: selectedLanguage,
                tags: tags.join(', '), // Pass tags as a comma-separated string
                code: templateCode,
                explanation: description,
            }),
        });

        const data = await res.json();
        if (res.status === 201) {
            alert('Template created successfully!');
            router.push(`/template/${data.id}`); // Redirect to the homepage or another page
        } else {
            alert(data.error);
        }
    };

    return (
        <div className="container my-20 mx-auto p-4 w-[50%]">
            <div className="border-2 border-gray-300 shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold">Create Template</h1>
                <div className="mt-4">
                    <label className="block text-lg">Template Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={templateTitle}
                        onChange={(e) => setTemplateTitle(e.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-lg">Description:</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Tags Section */}
                <div className="mt-4">
                    <label className="block text-lg">Tags:</label>
                    
                    {/* Display existing tags as blocks */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <div key={index} className="flex items-center bg-blue-200 px-3 py-1 rounded-full text-sm text-blue-700">
                                {tag}
                                <button
                                    className="ml-2 text-red-500"
                                    onClick={() => removeTag(tag)}
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

                <div className="mt-4">
                    <label className="block text-lg">Language:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-lg">Code:</label>
                    <MonacoEditorComponent
                        language={selectedLanguage}  // Ensure language is passed as a string
                        code={templateCode}          // Ensure code is passed as a string
                        onChange={(newCode) => setTemplateCode(newCode ?? '')}  // Update the code state
                        readOnly={false}
                    />
                </div>

                <div className="mt-4">
                    <button
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSaveTemplate}
                    >
                        Save Template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTemplatePage;
