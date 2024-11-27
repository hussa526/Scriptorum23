import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Blogpost } from '@/interface/Blogpost';
import { Template } from '@/interface/Template';
import { Vote } from '@/interface/Vote';

import EditBlogpost from '@/components/blogpost/EditBlogpost';
import Aside from '@/components/blogpost/TemplatesLeft';
import CommentsSection from '@/components/blogpost/CommentsSection';
import CodeTemplate from '@/components/template/CodeTemplate';

interface BlogpostUpdate {
    title: string;
    tags: string[];
    tagsDelete: string[];
    content: string;
    templates: Template[];
    templatesDelete: Template[];
}

interface BlogPostPageProps {
    post: {
        id: number;
        title: string;
        content: string;
        votes: Vote[];
    };
    comments: Comment[];
}

const BlogpostPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    
    const [blogpost, setBlogpost] = useState<Blogpost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingBlogpost, setIsEditingBlogpost] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [editedTitle, setEditedTitle] = useState('');

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
            const fetchBlogpost = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await fetch(`/api/blogpost/${id}`);
                    if (res.status === 404) {
                        setError('Page does not exist.');
                    } else {
                        const data = await res.json();
                        setBlogpost(data);
                        setEditedContent(data.content);
                        setEditedTitle(data.title);
                    }
                } catch (error) {
                    console.error('Error fetching blogpost:', error);
                    setError('Error fetching blogpost.');
                } finally {
                    setLoading(false);
                }
            };
            fetchBlogpost();
        }
    }, [id]);

    const handleEditCode = () => {
        setIsEditing(true);
    };


    const handleSaveBlogpost = async ({ title, tags, tagsDelete, content, templates, templatesDelete }: BlogpostUpdate) => {
        if (!blogpost) {
            console.error('Blogpost not found.');
            return;
        }
    
        const updatedBlogpost = {
            blogpostId: blogpost.id, // Blogpost ID remains part of the original template
            title: title,              // Updated title
            tagsAdded: tags,               // Updated tags (array of strings)
            tagsRemoved: tagsDelete,
            content: content ,        // Updated content
            templatesAdded: templates, // Updated templates
            templatesRemoved: templatesDelete,
        };
    
        try {
            const res = await fetch(`/api/blogpost/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBlogpost),
            });
    
            if (!res.ok) {
                throw new Error('Failed to update the Blogpost.');
            }
    
            const data = await res.json();
            console.log('Blogpost updated successfully:', data);
    
            setBlogpost(data);
    
            // Exit editing mode and update UI as necessary
            setIsEditingBlogpost(false);
        } catch (error) {
            console.error('Error saving blogpost:', error);
        }
    };


    const handleCancelEdit = () => {
        if (blogpost) {
            setEditedContent(blogpost.content); // Reset codeEdit to template's original code
            // TODO: fix
        }
        setIsEditing(false);
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center">{error}</p>;

    if (!blogpost) return <p className="text-center">Blogpost not found.</p>;

    const canEdit = () => {
        return blogpost && blogpost.user && blogpost.user.id === userId;
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 mt-16">
            {/* Sidebar: Templates */}
            <aside className="md:w-1/5 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6 space-y-4">
                <Aside templates={blogpost.templates} />
            </aside>

            {/* Main Content Area: Blogpost */}
            <main className="md:w-3/5 flex flex-col">
                {/* Blogpost Content */}
                <div className="flex-grow">
                <EditBlogpost blogpost={blogpost} handleSaveBlogpost={handleSaveBlogpost} setIsEditingBlogpost={setIsEditingBlogpost} handleCancelEdit={handleCancelEdit}></EditBlogpost>
                {/* <h1>{blogpost.title}</h1>
                <p>{blogpost.content}</p> */}
                </div>

                {/* Comments Section */}
                <div className="mt-6">
                <CommentsSection
                    comments={blogpost.comments}
                    blogpostId={blogpost.id}
                />
                </div>
            </main>
            </div>
    );
};

export default BlogpostPage;
