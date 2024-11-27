import { useState, useEffect } from 'react';
import { Template } from '@/interface/Template';
import { Blogpost } from '@/interface/Blogpost';
import { useRouter } from 'next/router';

interface BlogpostAsideProps {
    blogpost: Blogpost;
    canEdit: () => boolean;
    editedContent: string;
    setIsEditingContent: (isEditing: boolean) => void;
}

const BlogpostAside = ({ blogpost: blogpost, canEdit, editedContent: editedContent, setIsEditingContent: setIsEditingBlogpost }: BlogpostAsideProps) => {
    const router = useRouter();

    // const [isEditingTemplate, setIsEditingTemplate] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenFromStorage = localStorage.getItem("userToken");
            setToken(tokenFromStorage);
        }
    }, []);


    const handleEditBlogpost = () => {
        setIsEditingBlogpost(true);
        setShowPopup(false); // Close popup after selecting edit
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleDelete = async () => {
        if (blogpost) {
            try {
                const res = await fetch(`/api/blogpost/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ blogpostId: blogpost.id }),
                });
                alert("Blogpost deleted.");
                router.push({
                    pathname: `/`,
                });
            } catch (error) {
                console.error('Error deleting blogpost:', error);
                alert('Error deleting blogpost.');
            }
        }
    };

    const handleDeleteBlogpost = () => {
        handleDelete(); // Call the delete function
        setShowPopup(false); // Close popup after deleting
    };

    return (
        <div>
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            {blogpost.title} @{blogpost.id}
                        </h1>
                    </div>

                    {canEdit() && (
                        <div className="relative inline-block">
                            {/* Button that triggers the popup */}
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full focus:outline-none"
                                onClick={() => setShowPopup(!showPopup)}
                                aria-label="Edit Blogpost"
                                title="Edit Blogpost"
                            >
                                ⚙️
                            </button>

                            {/* Relative Popup */}
                            {showPopup && (
                                <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded shadow-lg w-48 z-10">
                                    <div className="mt-2">
                                        <button
                                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2"
                                            onClick={handleEditBlogpost}
                                        >
                                            Edit Blogpost
                                        </button>
                                        <button
                                            className="w-full bg-red-500 text-white py-2 px-4 rounded"
                                            onClick={handleDeleteBlogpost}
                                        >
                                            Delete Blogpost
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>                    
                <p className="text-gray-500">@{blogpost.user.username}</p>
                
                {blogpost.tags && blogpost.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                        {blogpost.tags.map((tag) => (
                        <div
                            key={tag.id}
                            className="bg-gray-500 text-white-800 px-6 py-2 rounded-md text-sm font-semibold shadow-md hover:bg-blue-200 transition-all duration-200 ease-in-out flex items-center justify-center"
                        >
                            {tag.tag}
                        </div>
                        ))}
                    </div>
                ) : null}

                {/* Explanation Section */}
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Content</h3>
                    <p className="text-gray-700 whitespace-pre-line">{blogpost.content ? blogpost.content : "No Content"}</p>
                </div>

            </div>
        </div>
    );
};

export default BlogpostAside;
