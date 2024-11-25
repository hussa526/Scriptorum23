import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

interface ReportItem {
    id: string; // Blogpost or comment ID
    type: "blogpost" | "comment";
    reportCount: number;
    isHidden: boolean;
}

const AdminHome: React.FC = () => {
    const auth = useContext(AuthContext);
    const router = useRouter();

    const [reports, setReports] = useState<ReportItem[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // Items per page
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `/api/auth/sortReports?page=${page}&limit=${limit}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${auth?.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();
            console.log(data);
            if (data.error) {
                alert(data.error);
                auth?.logout();
                router.push("/");
            }
            setTotalPages(data.totalPages);
            setReports(data.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred while fetching reports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleReportClick = (type: "blogpost" | "comment", id: string) => {
        router.push(`/reports/${type}/${id}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            {loading && <p className="text-lg text-blue-500">Loading...</p>}
            {error && <p className="text-lg text-red-500">{error}</p>}

            <div className="w-full max-w-4xl space-y-6">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleReportClick(report.type, report.id)}
                    >
                        <p className="font-semibold text-lg">
                            <strong>Type:</strong> {report.type} ({report.isHidden ? "Hidden" : "Not Hidden"})
                        </p>
                        <p>
                            <strong>Report Count:</strong> {report.reportCount}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="text-lg">Page {page} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminHome;
