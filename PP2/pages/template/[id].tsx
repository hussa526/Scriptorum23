import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Template } from '@/interface/Template';
import Link from 'next/link';
import MonacoEditorComponent from '@/components/CodeEditor';

import EditTemplate from '@/components/EditTemplate';
import Aside from '@/components/ForksBlogposts';
import TemplateAside from '@/components/TemplateInfo';

interface TemplateUpdate {
    title: string;
    tags: string[];
    tagsDelete: string[];
    explanation: string;
}


const TemplatePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingTemplate, setIsEditingTemplate] = useState(false);
    const [editedCode, setEditedCode] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenFromStorage = localStorage.getItem("userToken");
            const userIdFromStorage = Number(localStorage.getItem("userId"));
            setToken(tokenFromStorage);
            setUserId(userIdFromStorage);
        }
    }, []);

    useEffect(() => {
        if (id) {
            const fetchTemplate = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await fetch(`/api/template/${id}`);
                    if (res.status === 404) {
                        setError('Page does not exist.');
                    } else {
                        const data = await res.json();
                        setTemplate(data);
                        setEditedCode(data.code);
                    }
                } catch (error) {
                    console.error('Error fetching template:', error);
                    setError('Error fetching template.');
                } finally {
                    setLoading(false);
                }
            };
            fetchTemplate();
        }
    }, [id]);

    // const handleRunCode = async () => {
    //     setIsRunning(true);
    //     try {
    //         const res = await fetch(`/api/code/execute`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ language: template?.extension, code: editedCode, input: stdin }),
    //         });
    //         const data = await res.json();
    //         setStdout(data.stdout);
    //         setStderr(data.stderr);
    //     } catch (error) {
    //         console.error('Error running code:', error);
    //         setStdout('Error running code.');
    //     } finally {
    //         setIsRunning(false);
    //     }
    // };

    const handleEditCode = () => {
        setIsEditing(true);
    };

    const handleSaveCode = async () => {
        if (template) {
            setTemplate({ ...template, code: editedCode });
            setIsEditing(false);
            try {
                const res = await fetch(`/api/template/update`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tempId: template.id, code: editedCode }),
                });
                if (res.status == 401) {
                    alert('Unauthorized.');
                }
                const data = await res.json();
                setEditedCode(data.code);
            } catch (error) {
                console.error('Error saving template:', error);
                alert(error);
            }
        }
    };

    const handleSaveTemplate = async ({ title, tags, tagsDelete, explanation }: TemplateUpdate) => {
        if (!template) {
            console.error('Template not found.');
            return;
        }
    
        const updatedTemplate = {
            tempId: template.id, // Template ID remains part of the original template
            title,              // Updated title
            tagsAdded: tags,               // Updated tags (array of strings)
            tagsRemoved: tagsDelete,
            explanation,        // Updated explanation
        };
    
        try {
            const res = await fetch(`/api/template/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTemplate),
            });
    
            if (!res.ok) {
                throw new Error('Failed to update the template.');
            }
    
            const data = await res.json();
            console.log('Template updated successfully:', data);
    
            setTemplate(data);
    
            // Exit editing mode and update UI as necessary
            setIsEditingTemplate(false);
        } catch (error) {
            console.error('Error saving template:', error);
        }
    };

    const handleForkTemplate = async () => {
        if (template) {
            try {
                const res = await fetch(`/api/template/fork`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tempId: template.id }),
                });
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

    const handleCancelEdit = () => {
        if (template) {
            setEditedCode(template.code); // Reset codeEdit to template's original code
        }
        setIsEditing(false);
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center">{error}</p>;

    if (!template) return <p className="text-center">Template not found.</p>;

    const canEdit = template && template.user && template.user.id === userId;

    // const handleForkedLinkClick = () => {
    //     router.push(`/template/${template.forkedId}`);
    // };

    // const handleDelete = async () => {
    //     if (template) {
    //         try {
    //             const res = await fetch(`/api/template/delete`, {
    //                 method: 'DELETE',
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ tempId: template.id }),
    //             });
    //             alert("Template deleted.");
    //             router.push({
    //                 pathname: `/`,
    //             });
    //         } catch (error) {
    //             console.error('Error deleting template:', error);
    //             alert('Error deleting template.');
    //         }
    //     }
    // };

    // const handleClosePopup = () => {
    //     setShowPopup(false);
    // };

    // const handleEditTemplate = () => {
    //     setIsEditingTemplate(true);
    //     setShowPopup(false); // Close popup after selecting edit
    // };

    // const handleDeleteTemplate = () => {
    //     handleDelete(); // Call the delete function
    //     setShowPopup(false); // Close popup after deleting
    // };

    return (
        <>
        {/* <Navbar /> */}
        <div className="flex flex-col md:flex-row gap-6 p-6 mt-16">
            <aside className="md:w-1/5 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6 space-y-4">
                

                <Aside
                    blogPosts={template.blogposts} // Pass blogposts
                    forks={template.forks} // Pass forks
                    // onShowMorePosts={() => {}} // You can define show more logic here
                    // onShowMoreForks={() => {}} // Same for forks
                />
            </aside>


            <main className="md:w-1/2">
                <div className="space-y-4 mb-6 text-right">
                    {canEdit && (
                        <button
                            onClick={handleEditCode}
                            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-600"
                        >
                            Edit Code
                        </button>
                    )}
                    <button
                        onClick={handleForkTemplate}
                        className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-600"
                    >
                        Fork Template
                    </button>
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
            </main>

            <aside className="md:w-1/4 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6 space-y-4">
                {isEditingTemplate ? (
                    <EditTemplate
                        template={template}
                        handleSaveTemplate={handleSaveTemplate}
                        setIsEditingTemplate={setIsEditingTemplate}
                    />
                ) : (
                    <TemplateAside
                        template={template}
                        editedCode={editedCode}
                        setIsEditingTemplate={setIsEditingTemplate}
                    />
                    // // Normal Mode
                    // <div>
                    //     <div className="flex items-center justify-between">
                    //         <div>
                    //             <h1 className="text-2xl font-bold mb-2">
                    //                 {template.title} @{template.id}
                    //             </h1>
                    //             {template.isForked && (
                    //                 <h1 className="text-2xl font-bold mb-2">
                    //                     (Forked{' '}
                    //                     <span
                    //                         onClick={handleForkedLinkClick}
                    //                         className="text-blue-500 cursor-pointer hover:underline"
                    //                     >
                    //                         @{template.forkedId}
                    //                     </span>
                    //                     )
                    //                 </h1>
                    //             )}
                    //         </div>

                    //         <div className="relative inline-block">
                    //             {/* Button that triggers the popup */}
                    //             <button
                    //                 className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full focus:outline-none"
                    //                 onClick={() => setShowPopup(!showPopup)}
                    //                 aria-label="Edit Template"
                    //                 title="Edit Template"
                    //             >
                    //                 ⚙️
                    //             </button>

                    //             {/* Relative Popup */}
                    //             {showPopup && (
                    //                 <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded shadow-lg w-48 z-10">
                    //                     <h3 className="text-lg font-semibold">Choose an action</h3>
                    //                     <div className="mt-2">
                    //                         <button
                    //                             className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2"
                    //                             onClick={handleEditTemplate}
                    //                         >
                    //                             Edit Template
                    //                         </button>
                    //                         <button
                    //                             className="w-full bg-red-500 text-white py-2 px-4 rounded"
                    //                             onClick={handleDeleteTemplate}
                    //                         >
                    //                             Delete Template
                    //                         </button>
                    //                     </div>
                    //                     <div className="mt-4">
                    //                         <button
                    //                             className="text-gray-500 underline"
                    //                             onClick={handleClosePopup}
                    //                         >
                    //                             Cancel
                    //                         </button>
                    //                     </div>
                    //                 </div>
                    //             )}
                    //         </div>
                    //     </div>
                    //     <p className="text-gray-500">@{template.user.username}</p>
                        
                    //     {template.tags && template.tags.length > 0 ? (
                    //         <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    //             {template.tags.map((tag) => (
                    //             <div
                    //                 key={tag.id}
                    //                 className="bg-gray-500 text-white-800 px-6 py-2 rounded-md text-sm font-semibold shadow-md hover:bg-blue-200 transition-all duration-200 ease-in-out flex items-center justify-center"
                    //             >
                    //                 {tag.tag}
                    //             </div>
                    //             ))}
                    //         </div>
                    //     ) : null}

                    //     {/* Explanation Section */}
                    //     <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    //         <h3 className="text-lg font-semibold mb-2">Description</h3>
                    //         <p className="text-gray-700 whitespace-pre-line">{template.explanation ? template.explanation : "No Description"}</p>
                    //     </div>

                    //     <div>
                    //         <h3 className="text-lg font-semibold mb-2">Standard Input (stdin)</h3>
                    //         <textarea
                    //             className="w-full p-2 border rounded-md resize-none"
                    //             rows={5}
                    //             value={stdin}
                    //             onChange={(e) => setStdin(e.target.value)}
                    //             placeholder="Enter input for the program"
                    //         />
                    //     </div>
                    //     <button
                    //         className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    //         onClick={handleRunCode}
                    //         disabled={isRunning}
                    //     >
                    //         {isRunning ? 'Running...' : 'Run Code'}
                    //     </button>
                    //     <div>
                    //         <h3 className="text-lg font-semibold mb-2">Standard Error (stderr)</h3>
                    //         <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap break-words">
                    //             {stderr}
                    //         </pre>
                    //     </div>
                    //     <div>
                    //         <h3 className="text-lg font-semibold mb-2">Standard Output (stdout)</h3>
                    //         <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap break-words">
                    //             {stdout}
                    //         </pre>
                    //     </div>
                    // </div>
                )}
            </aside>
        </div>
        </>
    );
};

export default TemplatePage;
