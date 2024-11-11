import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Template } from '@/interface/Template';
import CodeSection from '@/components/CodeDisplay';
import Navbar from '@/components/Navbar';

const TemplatePage: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();
    const { id } = router.query;
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [stdin, setStdin] = useState('');
    const [stdout, setStdout] = useState('');
    const [stderr, setStderr] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
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

    const handleRunCode = async () => {
        setIsRunning(true);
        try {
            const res = await fetch(`/api/code/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language: template?.extension, code: template?.code, input: stdin }),
            });
            const data = await res.json();
            setStdout(data.stdout);
            const formattedStderr = data.stderr?.join('\n');
            setStderr(formattedStderr);
        } catch (error) {
            console.error('Error running code:', error);
            setStdout('Error running code.');
        } finally {
            setIsRunning(false);
        }
    };

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

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center">{error}</p>;

    if (!template) return <p className="text-center">Template not found.</p>;

    const canEdit = template.user.id === userId;

    const handleForkedLinkClick = () => {
        router.push(`/template/${template.forkedId}`);
    };

    return (
        <>
        {/* <Navbar /> */}
        <div className="flex flex-col md:flex-row gap-6 p-6 mt-16">
            <aside className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6 space-y-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">
                        {template.title} 
                        {template.isForked && (
                            <>
                                {' '}
                                (Forked{' '}
                                <span
                                    onClick={handleForkedLinkClick}
                                    className="text-blue-500 cursor-pointer hover:underline"
                                >
                                    @{template.forkedId}
                                </span>
                                )
                            </>
                        )}
                    </h1>
                    <p><strong>Explanation:</strong> {template.explanation}</p>
                    <p><strong>Created by:</strong> {template.user.username} </p>
                    <div>
                        <strong>Tags:</strong>
                        <ul className="list-disc ml-6">
                            {template.tags.map((tag) => (
                                <li key={tag.id}>{tag.tag}</li>
                            ))}
                        </ul>
                    </div>
                    <p><strong>Language:</strong> {template.extension} </p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Related Blog Posts</h2>
                    <ul className="space-y-2">
                        <li>Blog post 1</li>
                        <li>Blog post 2</li>
                        <li>Blog post 3</li>
                    </ul>
                </div>
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
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Fork Template
                    </button>
                </div>

                {isEditing ? (
                    <div className="w-full">
                        <textarea
                            value={editedCode}
                            onChange={(e) => setEditedCode(e.target.value)}
                            className="w-full p-4 border rounded-md resize-none"
                            rows={10}
                            placeholder="Edit your code"
                        />
                        <button
                            onClick={handleSaveCode}
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 mt-4"
                        >
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <CodeSection code={template.code} language="javascript" />
                )}
            </main>

            <aside className="md:w-1/4 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6 space-y-4">
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
            </aside>
        </div>
        </>
    );
};

export default TemplatePage;
