import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Template } from '@/interface/Template';
import Link from 'next/link';
import MonacoEditorComponent from '@/components/CodeEditor';

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
                body: JSON.stringify({ language: template?.extension, code: editedCode, input: stdin }),
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

    const handleCancelEdit = () => {
        if (template) {
            setEditedCode(template.code); // Reset codeEdit to template's original code
        }
        setIsEditing(false);
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
            <aside className="md:w-1/5 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6 space-y-4">
                {/* Related Blog Posts Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Blog Posts</h2>
                    <ul className="space-y-2">
                        {template.blogposts.map((blogpost) => (
                            <li key={blogpost.id} className="p-4 bg-white rounded-md shadow-md hover:bg-gray-50 transition duration-200">
                                {/* Link to the individual blog post page */}
                                <Link href={`/blogpost/${blogpost.id}`} className="block">
                                    {/* Blog Post Title */}
                                    <h3 className="font-semibold text-lg">{blogpost.title}</h3>

                                    {/* Blog Post Author */}
                                    <p className="mt-2 text-sm text-gray-600">
                                        By <strong>{blogpost.user.username}</strong>
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Related Forked Templates Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Forks</h2>
                    <ul className="space-y-2">
                        {template.forks.map((fork) => (
                            <li key={fork.id} className="p-4 bg-white rounded-md shadow-md hover:bg-gray-50 transition duration-200">
                                {/* Link to the individual forked template page */}
                                <Link href={`/template/${fork.id}`} className="block">
                                    {/* Forked Template Title */}
                                    <h3 className="font-semibold text-lg">{fork.title}</h3>

                                    {/* Forked Template Author */}
                                    <p className="mt-2 text-sm text-gray-600">
                                        By <strong>{fork.user.username}</strong>
                                    </p>
                                </Link>
                            </li>
                        ))}
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
                <div>
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold mb-2">
                            {template.title}
                        </h1>
                        <p>{template.isForked && (
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
                        )}</p>
                    </div>

                    <p className="text-gray-500">@{template.user.username}</p>

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
            </aside>
        </div>
        </>
    );
};

export default TemplatePage;
