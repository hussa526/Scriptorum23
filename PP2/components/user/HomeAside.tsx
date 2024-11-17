import React, { useState, useEffect } from 'react';
import UserAccount from '@/components/user/UserAccount';

export default function Sidebar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for token in localStorage or cookies
        const token = localStorage.getItem('userToken'); // Replace with your token logic
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <aside className="w-full bg-gray-100 p-4 rounded-lg shadow-md">
            {/* User Account */}
            {isLoggedIn && (
                <div className="mb-6">
                    <UserAccount />
                </div>
            )}
        </aside>
    );
}
