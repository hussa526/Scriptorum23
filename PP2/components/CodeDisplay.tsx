// components/CodeSection.tsx
import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useDarkMode } from '../context/DarkModeContext';

interface CodeSectionProps {
    code: string;
    language: string;
}

const CodeSection: React.FC<CodeSectionProps> = ({ code, language }) => {    
    const style = solarizedLight; // monokai for dark mode
    const lines = code.split('\n');

    return (
        <div className="flex bg-gray-100 rounded-md overflow-auto text-sm">
            <div className="bg-gray-200 text-gray-500 px-2 py-2 text-right select-none flex flex-col items-end">
                {lines.map((_, index) => (
                    <div key={index} className="leading-5">
                        {index + 1}
                    </div>
                ))}
            </div>

            <div className="px-2 py-2 whitespace-pre-wrap break-words">
                <SyntaxHighlighter
                    language={language}
                    style={style}
                    customStyle={{ backgroundColor: 'transparent', padding: 0 }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeSection;