import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Template } from '@/interface/Template';

import EditTemplate from '@/components/template/EditTemplate';
import Aside from '@/components/template/ForksBlogposts';
import TemplateAside from '@/components/template/TemplateInfo';
import CodeTemplate from '@/components/template/CodeTemplate';

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

    const canEdit = () => {
        return template && template.user && template.user.id === userId;
    };

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
                <CodeTemplate 
                    template={template}
                    canEdit={canEdit} 
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    editedCode={editedCode}
                    setEditedCode={setEditedCode}
                    handleSaveCode={handleSaveCode}
                />
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
                        canEdit={canEdit}
                        editedCode={editedCode}
                        setIsEditingTemplate={setIsEditingTemplate}
                    />
                )}
            </aside>
        </div>
        </>
    );
};

export default TemplatePage;
