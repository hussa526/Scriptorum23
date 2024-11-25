import { useState } from 'react';

import { User } from '@/interface/User';

interface AccountProps {
    user: User | null;
    loading: boolean;
    handleEditUser: () => void;
}

const Account = ({ user, handleEditUser, loading, }: AccountProps) => {
    const [showPopup, setShowPopup] = useState(false);
    // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to handle delete confirmation

    // const handleConfirmDelete = () => {
    //     setShowDeleteConfirm(false); // Close the confirmation
    //     handleDeleteUser(); // Call the delete handler
    // };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Account Details</h2>

            {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : user ? (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        {/* Left side: Avatar and Username */}
                        <div className="flex items-center space-x-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shadow-md">
                                <img
                                    src={`/avatars/${user?.avatar || 'default.png'}`}
                                    alt={`${user?.username}'s avatar`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Username */}
                            <div className="text-lg text-black">
                                <span className="font-semibold">@{user?.username} {user?.role === 'admin' && (user?.role)}</span>
                            </div>
                        </div>

                        {/* Right side: Edit button */}
                        <div className="relative inline-block">
                            {/* Button that triggers the popup */}
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full focus:outline-none"
                                onClick={() => setShowPopup(!showPopup)}
                                aria-label="Edit Template"
                                title="Edit Template"
                            >
                                ⚙️
                            </button>

                            {/* Popup - Conditional rendering */}
                            {showPopup && (
                                <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded shadow-lg w-48 z-10">
                                    <div className="space-y-2">
                                        {/* Edit Code Button */}
                                        <button
                                            className="w-full bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={handleEditUser}
                                        >
                                            Edit Account
                                        </button>
                                        {/* Delete Account Button */}
                                        {/* <button
                                            className="w-full bg-red-500 text-white py-2 px-4 rounded mt-2"
                                            onClick={() => setShowDeleteConfirm(true)} // Show confirmation before deletion
                                        >
                                            Delete Account
                                        </button> */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Full Name</label>
                            <p className="text-lg font-semibold text-gray-700">{user.firstName} {user.lastName}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <p className="text-lg font-semibold text-gray-700">{user.email}</p>
                        </div>

                        {user.phone && (
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Phone</label>
                                <p className="text-lg font-semibold text-gray-700">{user.phone}</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">No user data found.</div>
            )}

            {/* Delete Account Confirmation Modal */}
            {/* {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">Are you sure you want to delete your account?</h3>
                        <div className="flex justify-around">
                            <button
                                className="bg-gray-500 text-white py-2 px-4 rounded"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded"
                                onClick={handleConfirmDelete}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default Account;
