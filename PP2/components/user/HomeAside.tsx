import React, { useState, useEffect, useContext } from 'react';
import UserAccount from '@/components/user/UserAccount';
import UnauthorizedAside from '@/components/user/UnauthorizedAside';
import { AuthContext } from '@/context/AuthContext';

export default function Sidebar() {
    const auth = useContext(AuthContext);

    return (
        <aside className="w-full bg-gray-100 p-4 rounded-lg shadow-md">
            {/* User Account */}
            {auth?.isAuthenticated ? (
                <div className="mb-6">
                    <UserAccount />
                </div>
            ) : (
                <div className="mb-6">
                    <UnauthorizedAside />
                </div>
            )}
        </aside>
    );
}
