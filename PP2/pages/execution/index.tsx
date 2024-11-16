import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter

import MonacoEditorComponent from '@/components/CodeEditor';

const CodeEditorPage: React.FC = () => {
    const router = useRouter(); // Use Next.js Router

    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');

    const [stdin, setStdin] = useState('');
    const [stdout, setStdout] = useState('');
    const [stderr, setStderr] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        try {
            console.log(language, code, stdin);
            const res = await fetch(`/api/code/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language, code, stdin }),
            });
            const data = await res.json();
            console.log(data);
            
            // if (data.error) {
            //     alert(data.error);
            // }
            setStdout(data.stdout);
            setStderr(data.stderr);
        } catch (error) {
            console.error('Error running code:', error);
            setStdout('Error running code.');
        } finally {
            setIsRunning(false);
        }
    };

    const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(event.target.value);
    };

    // Redirect to Create Template page with language and code as POST data
    const handleCreateTemplate = async () => {
        router.push({
            pathname: '/template/create', // Assuming the CreateTemplatePage is under /template/create
            query: { language, code }, // Pass language and code as query params
        });
    };

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
    };

    return (
        <>
        <div className="flex flex-col md:flex-row space-y-8 md:space-x-8 p-6">
            {/* <aside className="w-full md:w-1/4 space-y-4">
                <h3 className="text-lg font-semibold">Left Sidebar</h3>
                <div className="p-4 border rounded-md">
                    <p>Some content for the left sidebar.</p>
                </div>
            </aside> */}

            <div className="flex-1 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Code Editor</h1>
                
                <label className="block mb-2 font-semibold">Select Language:</label>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="mb-4 p-2 border rounded"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="go">Go</option>
                    <option value="ruby">Ruby</option>
                    <option value="rust">Rust</option>
                    <option value="php">Php</option>
                    <option value="r">R</option>
                    <option value="perl">Perl</option>
                    <option value="Haskell">Haskell</option>
                </select>

                <MonacoEditorComponent
                    language={language}
                    code={code}
                    onChange={handleEditorChange}
                    readOnly={false}
                />

                <button
                    className="w-full bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600"
                    onClick={handleCreateTemplate}
                >
                    Create Template
                </button>
            </div>

            <aside className="w-full md:w-1/4 space-y-4">
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

export default CodeEditorPage;
