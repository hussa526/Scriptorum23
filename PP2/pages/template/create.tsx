import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

const CreateTemplatePage: React.FC = () => {
    const router = useRouter();
    const { language, code } = router.query; // Get the language and code from query params

    const [templateTitle, setTemplateTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string | string[] | undefined>(language);
    const [templateCode, setTemplateCode] = useState<string | string[] | undefined>(code);

    // Set the code and language when the component mounts
    useEffect(() => {
        if (language && code) {
            // If the language and code are available, you can display them or use them
            setSelectedLanguage(language);
            setTemplateCode(code);
        }
    }, [language, code]);

    const handleSaveTemplate = async () => {
        const userToken = localStorage.getItem("userToken");
        
        // API call to save the template
        const res = await fetch('/api/template/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify({
                title: templateTitle,
                extension: selectedLanguage,
                code: templateCode,
                description,
            }),
        });

        const data = await res.json();
        if (res.status === 201) {
          alert('Template created successfully!');
          router.push(`/template/${data.id}`); // Redirect to the homepage or another page
        } else {
          alert(data.error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Create Template</h1>
            <div className="mt-4">
                <label className="block text-lg">Template Name:</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={templateTitle}
                    onChange={(e) => setTemplateTitle(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label className="block text-lg">Description:</label>
                <textarea
                    className="w-full p-2 border rounded"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label className="block text-lg">Language:</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label className="block text-lg">Code:</label>
                <textarea
                    className="w-full p-2 border rounded"
                    rows={8}
                    value={templateCode}
                    readOnly
                />
            </div>
            <div className="mt-4">
                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSaveTemplate}
                >
                    Save Template
                </button>
            </div>
        </div>
    );
};

export default CreateTemplatePage;
