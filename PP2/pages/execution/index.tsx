import React, { useState, useRef, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useRouter } from 'next/router'; // Import useRouter

const CodeEditorPage: React.FC = () => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [stdin, setStdin] = useState('');
    const [stdout, setStdout] = useState('');
    const [stderr, setStderr] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const syntaxHighlighterRef = useRef<HTMLDivElement>(null);
    const router = useRouter(); // Use Next.js Router

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
            
            if (data.error) {
                alert(data.error);
            } else {
                setStdout(data.stdout);
                const formattedStderr = data.stderr?.join('\n');
                setStderr(formattedStderr);
            }
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

    useEffect(() => {
        // Sync height between textarea and syntax highlighter
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    
        if (syntaxHighlighterRef.current) {
            // syntaxHighlighterRef.current.style.height = 'auto';
            syntaxHighlighterRef.current.style.height = `${textAreaRef.current?.scrollHeight}px`;
        }
    }, [code]);

    useEffect(() => {
        const syncScroll = () => {
            if (textAreaRef.current && syntaxHighlighterRef.current) {
                syntaxHighlighterRef.current.scrollTop = textAreaRef.current.scrollTop;
            }
        };
    
        if (textAreaRef.current) {
            textAreaRef.current.addEventListener('scroll', syncScroll);
    
            return () => {
                textAreaRef.current?.removeEventListener('scroll', syncScroll);
            };
        }
    }, []);

    const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent the default behavior (focusing next element)

            const textarea = textAreaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                
                // Insert tab character at cursor position
                setCode(code.slice(0, start) + '\t' + code.slice(end));

                // Move cursor position after the tab
                setTimeout(() => {
                    if (textarea) {
                        textarea.selectionStart = textarea.selectionEnd = start + 1;
                    }
                }, 0);
            }
        }
    };

    return (
        <>
        <div className="flex flex-col md:flex-row space-y-8 md:space-x-8 p-6">
            <aside className="w-full md:w-1/4 space-y-4">
                <h3 className="text-lg font-semibold">Left Sidebar</h3>
                <div className="p-4 border rounded-md">
                    <p>Some content for the left sidebar.</p>
                </div>
            </aside>

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
                    <option value="c++">C++</option>
                    <option value="c">C</option>
                </select>
                
                <div className="flex">
                    {/* Line numbers */}
                    <div className="bg-gray-200 text-sm text-gray-400 py-3 px-2 flex flex-col items-end select-none rounded-l-md sticky">
                        {code.split('\n').map((_, index) => (
                            <div key={index} className="leading-6">
                                {index + 1}
                            </div>
                        ))}
                    </div>

                    <div className="relative flex-1 bg-gray-100">

                        {/* Syntax Highlighter */}
                        <div
                            ref={syntaxHighlighterRef}
                            className="absolute inset-0 w-full leading-6 text-[12px] overflow-auto pointer-events-none rounded-r-md border bg-white"
                            aria-hidden="true"
                            style={{
                                padding: '0.75rem',
                                backgroundColor: 'transparent',
                                minHeight: '500px',
                                // maxHeight: '700px',
                            }}
                        >
                            <SyntaxHighlighter
                                language={language}
                                style={solarizedLight}
                                customStyle={{
                                    backgroundColor: 'transparent',
                                    padding: 0,
                                    margin: 0,
                                    overflowX: 'auto',
                                }}
                            >
                                {code || ' '}
                            </SyntaxHighlighter>
                        </div>

                        {/* Textarea for Editing */}
                        <textarea
                            ref={textAreaRef}
                            className="font-mono relative w-full leading-6 text-[12px] text-transparent caret-black p-3 border rounded-r-md resize-none bg-transparent focus:ring-0 focus:border-gray-400 focus:outline-none"
                            value={code}
                            onChange={handleCodeChange}
                            onKeyDown={(e) => handleTab(e)}
                            rows={10}
                            spellCheck="false"
                            style={{
                                backgroundColor: 'transparent',
                                zIndex: 2,
                                minHeight: '500px', // Set minimum height to keep a reasonable size
                                overflowX: 'auto',
                                whiteSpace: 'pre',
                                // maxHeight: '700px', // Add max height to prevent infinite scrolling
                            }}
                        />
                    </div>
                </div>

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
