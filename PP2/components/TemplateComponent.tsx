import React from 'react';

import Link from 'next/link';

import { Template } from '@/interface/Template';

export interface TemplateComponentProps {
    template: Template;
}

const TemplateComponent: React.FC<TemplateComponentProps> = ({ template }) => {
    return (
        <Link href={`/template/${template.id}`} className="relative w-[70%] bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 mb-6 hover:shadow-2xl hover:scale-105 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 ease-in-out transform">           
            {/* Title and Explanation */}
            <div className="flex items-center space-x-2">
                <h2 className="text-left text-2xl font-semibold text-gray-800">{template.title}</h2>
                <p className="text-gray-600">@{template.user.username}</p>
            </div>

            <p className="text-left text-gray-600 text-left mb-4">{template.explanation ? template.explanation : "No Description"}</p>

            {/* Display tags as small boxes */}
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

            {/* Code Display Box */}
            <div className="w-full h-32 p-4 bg-gray-100 border-2 border-gray-300 rounded-md overflow-hidden">
                <pre className="w-full text-left text-xs font-mono text-gray-800 whitespace-pre-wrap break-words">
                {(() => {
                    const codeLines = template.code.split('\n');
                    const displayedCode = codeLines.slice(0, 5).join('\n');
                    return codeLines.length > 5 ? `${displayedCode}\n...` : displayedCode;
                })()}
                </pre>
            </div>
        </Link>
    );
};


export default TemplateComponent;
