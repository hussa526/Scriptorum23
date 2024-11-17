// components/MonacoEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface MonacoEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean; // Optional prop to control readOnly status
}

const MonacoEditorComponent: React.FC<MonacoEditorProps> = ({ language, code, onChange, readOnly = false }) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // This effect will run once the editor is mounted
    if (editorRef.current) {
      const editor = editorRef.current;
      // Dynamically toggle readOnly if the readOnly prop changes
      editor.updateOptions({ readOnly });
    }
  }, [readOnly]); // Dependency array ensures the effect runs when readOnly prop changes

  return (
    <>
        <div className="h-[60vh]">
        <div className="bg-gray-300 text-gray-700 text-sm font-semibold px-4 py-1 rounded-t-md">
            {language}
        </div>

        <MonacoEditor
            height="90%"
            language={language}
            value={code}
            onChange={onChange}
            onMount={(editor) => {
                editorRef.current = editor; // Store editor reference
                editor.updateOptions({ readOnly }); // Set the initial readOnly state
            }}
            theme="vs-light"
        />
        </div>
    </>
  );
};

export default MonacoEditorComponent;
