import { useState, useEffect } from 'react';
import { Template } from '@/interface/Template';
import { useRouter } from 'next/router';

interface TemplateAsideProps {
    template: Template;
    canEdit: () => boolean;
    editedCode: string;
    setIsEditingTemplate: (isEditing: boolean) => void;
}

const TemplateAside = ({ template, canEdit, editedCode, setIsEditingTemplate }: TemplateAsideProps) => {
    const router = useRouter();

    const [stdin, setStdin] = useState('');
    const [stdout, setStdout] = useState('');
    const [stderr, setStderr] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    // const [isEditingTemplate, setIsEditingTemplate] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenFromStorage = localStorage.getItem("userToken");
            setToken(tokenFromStorage);
        }
    }, []);

    const handleRunCode = async () => {
        setIsRunning(true);
        try {
            const res = await fetch(`/api/code/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language: template?.extension, code: editedCode, input: stdin }),
            });
            const data = await res.json();
            setStdout(data.stdout);
            setStderr(data.stderr);
        } catch (error) {
            console.error('Error running code:', error);
            setStdout('Error running code.');
        } finally {
            setIsRunning(false);
        }
    };

    const handleForkedLinkClick = () => {
        router.push(`/template/${template.forkedId}`);
    };

    const handleEditTemplate = () => {
        setIsEditingTemplate(true);
        setShowPopup(false); // Close popup after selecting edit
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleDelete = async () => {
        if (template) {
            try {
                const res = await fetch(`/api/template/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tempId: template.id }),
                });
                alert("Template deleted.");
                router.push({
                    pathname: `/`,
                });
            } catch (error) {
                console.error('Error deleting template:', error);
                alert('Error deleting template.');
            }
        }
    };

    const handleDeleteTemplate = () => {
        handleDelete(); // Call the delete function
        setShowPopup(false); // Close popup after deleting
    };

    return (
        <div>
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            {template.title} @{template.id}
                        </h1>
                        {template.isForked && template.forkedId && (
                            <h1 className="text-2xl font-bold mb-2">
                                (Forked{' '}
                                <span
                                    onClick={handleForkedLinkClick}
                                    className="text-blue-500 cursor-pointer hover:underline"
                                >
                                    @{template.forkedId}
                                </span>
                                )
                            </h1>
                        )}
                    </div>

                    {canEdit() && (
                        <div className="relative inline-block">
                            {/* Button that triggers the popup */}
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full focus:outline-none"
                                onClick={() => setShowPopup(!showPopup)}
                                aria-label="Edit Template"
                                title="Edit Template"
                            >
                                ⚙️
                            </button>

                            {/* Relative Popup */}
                            {showPopup && (
                                <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded shadow-lg w-48 z-10">
                                    <div className="mt-2">
                                        <button
                                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2"
                                            onClick={handleEditTemplate}
                                        >
                                            Edit Template
                                        </button>
                                        <button
                                            className="w-full bg-red-500 text-white py-2 px-4 rounded"
                                            onClick={handleDeleteTemplate}
                                        >
                                            Delete Template
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>                    
                <p className="text-gray-500">@{template.user.username}</p>
                
                {template.tags && template.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                        {template.tags.map((tag) => (
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
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{template.explanation ? template.explanation : "No Description"}</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Standard Input (stdin)</h3>
                    <textarea
                        className="w-full p-2 border rounded-md resize-none"
                        rows={5}
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                        placeholder="Enter input for the program"
                    />
                </div>
                <button
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    onClick={handleRunCode}
                    disabled={isRunning}
                >
                    {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Standard Error (stderr)</h3>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap break-words">
                        {stderr}
                    </pre>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Standard Output (stdout)</h3>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap break-words">
                        {stdout}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default TemplateAside;
