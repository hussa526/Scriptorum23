import React from "react";
import { useRouter } from 'next/router';

export default function UnauthorizedAside() {
	const router = useRouter();

	return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-12">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg space-y-6">
                <p className="text-gray-700 text-xl font-semibold text-center">
                    Create an account or login to view your profile.
                </p>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => router.push("/user/create")}
                        className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Create an Account
                    </button>
                    <button
                        onClick={() => router.push("/user/login")}
                        className="bg-transparent text-blue-500 py-3 px-6 rounded-lg border-2 border-blue-500 shadow-md hover:bg-blue-500 hover:text-white transition duration-300"
                    >
                        Login to Account
                    </button>
                </div>
            </div>
        </div>
    );
}
