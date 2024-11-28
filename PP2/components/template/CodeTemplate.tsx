import { useState, useEffect } from 'react';
import { Template } from '@/interface/Template';
import { useRouter } from 'next/router';

import MonacoEditorComponent from '@/components/CodeEditor';

interface TemplateAsideProps {
    template: Template;
    canEdit: () => boolean;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    editedCode: string;
    setEditedCode: (code: string) => void;
    handleSaveCode: () => void;
}

const TemplateAside = ({ template, canEdit, isEditing, setIsEditing, editedCode, setEditedCode, handleSaveCode }: TemplateAsideProps) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenFromStorage = localStorage.getItem("userToken");
            setToken(tokenFromStorage);
        }
    }, []);
    
    const handleEditCode = () => {
        setIsEditing(true);
        setShowPopup(false);
    };

    const handleCancelEdit = () => {
        if (template) {
            setEditedCode(template.code); // Reset codeEdit to template's original code
        }
        setIsEditing(false);
    };

    const handleForkTemplate = async () => {
        if (template) {
            try {
                setShowPopup(false);
                const res = await fetch(`/api/template/fork`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tempId: template.id }),
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        alert("You need to be logged in to fork a template.");
                        return;
                    }
                    throw new Error("Failed to fork");
                }
                const data = await res.json();
                router.push({
                    pathname: `/template/${data.id}`,
                });
            } catch (error) {
                console.error('Error forking template:', error);
                alert('Error forking template.');
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-center p-2">
                <h1 className="text-2xl font-bold mb-2">
                    Code
                </h1>

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

                    {/* Popup - Conditional rendering */}
                    {showPopup && (
                        <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded shadow-lg w-48 z-10">
                        <div className="space-y-2">
                            {/* Edit Code Button */}
                            {canEdit() && (
                                <button
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded"
                                    onClick={handleEditCode}
                                    >
                                    Edit Code
                                </button>
                            )}

                            {/* Fork Template Button */}
                            <button
                                className="w-full bg-red-500 text-white py-2 px-4 rounded"
                                onClick={handleForkTemplate}
                                >
                                Fork Template
                            </button>
                        </div>
                        </div>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div>
                    <MonacoEditorComponent
                        language={template.extension}
                        code={editedCode}
                        onChange={(value) => setEditedCode(value || '')}
                    />
                    <button
                        onClick={handleSaveCode}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 mt-4"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 mt-4 ml-2"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <MonacoEditorComponent
                    language={template.extension}
                    code={template.code}
                    onChange={() => {}}
                    readOnly={true}
                />
            )}
        </>
    );
};

export default TemplateAside;
