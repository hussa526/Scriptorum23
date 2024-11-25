import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import { User } from "@/interface/User";
import { AuthContext } from "@/context/AuthContext";

interface Report {
    explanation: string;
    user: {
        id: string;
        username: string;
    };
}

interface BlogPostOrComment {
    id: string;
    user: User;
    title?: string; // For blogposts
    content?: string; // For comments
    reports: Report[];
    text?: string;
    isHidden: boolean;
}

const ReportDetailPage: React.FC = () => {
    const router = useRouter();
    const auth = useContext(AuthContext);
    const { type, id } = router.query; // Extract type and ID from URL

    const [data, setData] = useState<BlogPostOrComment | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = async () => {
        if (!type || !id) return;

        setLoading(true);
        setError(null);
        try {
            console.log(`/api/admin/${type}/${id}`);
            const response = await fetch(`/api/admin/${type}/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${auth?.token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();

            console.log(result);
            setData(result);
        } catch (err) {
            setError("An error occurred while fetching details.");
        } finally {
            setLoading(false);
        }
    };

    const hideContent = async () => {
        if (!type || !id) return;

        try {
            const response = await fetch(`/api/admin/${type}/hide`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${auth?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: Number(id) }),
            });

            if (!response.ok) {
                throw new Error("Failed to hide the content.");
            }

            alert("Content has been successfully hidden.");
        } catch (err) {
            console.error(err);
            alert("An error occurred while hiding the content.");
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [type, id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 py-20">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                {data && (
                    <>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Report Details ({data?.isHidden ? "Hidden" : "Not Hidden"})</h1>
                        {!data?.isHidden && (
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm focus:outline-none"
                                onClick={hideContent}
                            >
                                Hide Content
                            </button>
                        )}
                    </div>

                
                    
                        {type === "blogpost" && (
                            <>
                                <h2 className="text-xl font-semibold">Title: {data.title}</h2>
                                <p className="mt-4">{data.content}</p>
                            </>
                        )}
                        {type === "comment" && (
                            <>
                                <ul className="space-y-4 mt-4">
                                    <li
                                        key={data.id}
                                        className="p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200"
                                    >
                                        <p>
                                            <strong>Comment @{data.id}:</strong> @{data.user.username}
                                        </p>
                                        <p className="text-lg">{data.text}</p>
                                    </li>
                                </ul>
                            </>
                        )}
                        <h2 className="text-xl font-semibold mt-6">Reports:</h2>
                        <ul className="space-y-4 mt-4">
                            {data.reports.map((report, index) => (
                                <li
                                    key={index}
                                    className="p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200"
                                >
                                    <p>
                                        <strong>Reported by:</strong> @{report.user.username}
                                    </p>
                                    <p>
                                        <strong>Explanation:</strong> {report.explanation}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportDetailPage;
