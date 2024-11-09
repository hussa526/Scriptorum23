import React, { useState, useEffect } from 'react';
import TemplateComponent from './TemplateComponent';
import BlogpostComponent from './BlogpostComponent';

export default function SearchComponent() {
    const [searchQuery, setSearchQuery] = useState('');
    const [templates, setTemplates] = useState<any[]>([]);
    const [blogposts, setBlogposts] = useState<any[]>([]); // Assuming you are also fetching blogposts
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<'templates' | 'blogposts'>('templates'); // Track selected type
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    // Handle input change for search query
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Handle search form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setPage(1); // Reset to page 1
        fetchData(); // Fetch data based on search query and selected type
    };

    // Fetch data based on selected type (templates or blogposts)
    const fetchData = async () => {
        setLoading(true);
        console.log('Fetching data for:', searchQuery, 'on page', page, 'for', selectedType);

        try {
            let response;
            if (selectedType === 'templates') {
                // Fetch templates
                response = await fetch(
                    `http://localhost:3000/api/template?page=${page}&limit=${limit}&query=${searchQuery}`
                );
                const data = await response.json();
                setTemplates(data.templates);
                setTotalPages(data.totalPages);
            } else if (selectedType === 'blogposts') {
                // Fetch blogposts
                response = await fetch(
                    `http://localhost:3000/api/blogpost?page=${page}&limit=${limit}&query=${searchQuery}`
                );
                const data = await response.json();
                setBlogposts(data.blogposts);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Toggle between templates and blogposts
    const handleTypeChange = (type: 'templates' | 'blogposts') => {
        setSelectedType(type);
    };

    useEffect(() => {
        fetchData(); // Fetch data whenever page, search query, or selectedType changes
    }, [page, searchQuery, selectedType]);

    // Pagination handlers
    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="bg-blue-300 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Search</h2>
            
            <div className="flex justify-center items-center w-full">
                {/* Search form */}
                <form onSubmit={handleSubmit} className="flex items-center mb-4 space-x-2 w-[500px]">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder="Search here..."
                        className="p-2 w-full border rounded-md"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
                    >
                        <span className="text-lg">{'→'}</span>
                    </button>
                </form>
            </div>


            {/* Toggle buttons for selecting between templates or blogposts */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => handleTypeChange('templates')}
                    className={`p-2 ${selectedType === 'templates' ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md hover:bg-blue-600`}
                >
                    Templates
                </button>
                <button
                    onClick={() => handleTypeChange('blogposts')}
                    className={`p-2 ${selectedType === 'blogposts' ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md hover:bg-blue-600`}
                >
                    Blogposts
                </button>
            </div>

            {/* Loading Spinner */}
            {loading && <div>Loading...</div>}

            {/* Display templates or blogposts based on selectedType */}
            <div className="mt-4">
                {/* Templates */}
                {!loading && selectedType === 'templates' && templates.length > 0 && (
                    <div className="flex flex-col items-center">
                        {templates.map((template) => (
                            <TemplateComponent key={template.id} template={template} />
                        ))}
                    </div>
                )}

                {!loading && selectedType === 'blogposts' && blogposts.length > 0 && (
                    <div className="flex flex-col items-center">
                        {blogposts.map((blogpost) => (
                            <BlogpostComponent key={blogpost.id} blogpost={blogpost} />
                        ))}
                    </div>
                )}

                {/* No Results Message */}
                {(!loading && selectedType === 'blogposts' && blogposts.length === 0) || (selectedType === 'templates' && templates.length === 0) ? (
                    <div className="flex flex-col items-center">
                        <div
                            key={"none"}
                            className="w-[70%] bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-2xl hover:scale-105 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 ease-in-out transform"
                        >
                            <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">No Results Found</h2>
                            <p className="text-center text-gray-600 mb-4 text-left">There are no {selectedType} to display.</p>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Pagination controls */}
            <div className="mt-4 flex justify-center space-x-4">
                <button
                    onClick={goToPreviousPage}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="flex items-center justify-center">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
