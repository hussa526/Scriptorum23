import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Template } from '@/interface/Template';
import CodeSection from '@/components/CodeDisplay';
import Navbar from '@/components/Navbar';

// this is the main page that handles template viewing

const TemplatePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [stdin, setStdin] = useState('');
    const [stdout, setStdout] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);  // New state for error handling

    useEffect(() => {
        if (id) {
            const fetchTemplate = async () => {
                setLoading(true);
                setError(null);  // Reset error on each fetch
                try {
                    const res = await fetch(`/api/template/${id}`);
                    
                    if (res.status === 404) {
                        // Template not found, set error state
                        setError('Page does not exist.');
                    } else {
                        const data = await res.json();
                        setTemplate(data);
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
            const res = await fetch(`/api/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: template?.code, input: stdin }),
            });
            const data = await res.json();
            setStdout(data.output);
        } catch (error) {
            console.error('Error running code:', error);
            setStdout('Error running code.');
        } finally {
            setIsRunning(false);
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center">{error}</p>;  // Show error message if template is not found

    if (!template) return <p className="text-center">Template not found.</p>;

    return (
        <>
        <Navbar />
        <div className="flex flex-col md:flex-row gap-6 p-6 mt-16">
            {/* Left sidebar with template details and blog posts */}
            <aside className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6 space-y-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{template.title}</h1>
                    <p><strong>Explanation:</strong> {template.explanation}</p>
                    <p><strong>Created by:</strong> Hello </p>
                    <div>
                        <strong>Tags:</strong>
                        <ul className="list-disc ml-6">
                            {template.tags.map((tag) => (
                                <li key={tag.id}>{tag.tag}</li>
                            ))}
                        </ul>
                    </div>
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

            {/* Center content for code display */}
            <main className="md:w-1/2">
                <CodeSection code={template.code} language="javascript" />
            </main>

            {/* Right sidebar for stdin, stdout, and run button */}
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