import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';

import { User } from '@/interface/User';

interface EditAccountProps {
    saveEditUser: (data: { firstName: string, lastName: string, email: string, phone: string, avatar: string }) => void;
}

const avatarList = [
    'default.png',
    'pink.jpg',
    'superhero.jpg',
    'superhero2.png',
    'superhero3.png',
    'superhero4.png',
    'chicken.jpg',
    'panda.jpg',
    'cop.png',
];

const EditAccount = ({ saveEditUser }: EditAccountProps) => {
    const router = useRouter();
    const auth = useContext(AuthContext);

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (auth?.username && auth?.token) {
                try {
                    const response = await fetch(`/api/auth/${auth.username}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${auth.token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) throw new Error("Failed to fetch user data");

                    const data = await response.json();
                    setUser(data);
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setEmail(data.email);
                    setPhone(data.phone || '');
                    setAvatar(data.avatar || '');
                    setUsername(data.username);
                } catch (error) {
                    console.error("Error fetching user:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [auth]);

    const handleSave = async () => {
        saveEditUser({ firstName, lastName, email, phone, avatar });
    };

    const handleAvatarSelect = (selectedAvatar: string) => {
        setAvatar(selectedAvatar);
        setShowPopup(false); // Close the popup after selection
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Edit Account</h2>

                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : user ? (
                    <div>
                        {/* Avatar Section */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shadow-md">
                                    <img
                                        src={`/avatars/${avatar || 'default.png'}`}
                                        alt={`${username}'s avatar`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-lg text-black">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="font-semibold text-lg text-black bg-transparent border-b-2 border-gray-300 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="relative inline-block">
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full focus:outline-none"
                                    onClick={() => setShowPopup(!showPopup)}
                                >
                                    ⚙️
                                </button>
                                {showPopup && (
                                    <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded shadow-lg w-64 z-10">
                                        <div className="grid grid-cols-3 gap-2">
                                            {avatarList.map((avatarFile) => (
                                                <div
                                                    key={avatarFile}
                                                    className="w-16 h-16 cursor-pointer rounded-full overflow-hidden shadow-md border border-gray-300"
                                                    onClick={() => handleAvatarSelect(avatarFile)}
                                                >
                                                    <img
                                                        src={`/avatars/${avatarFile}`}
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Editable User Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full"
                                />
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full mt-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Phone</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full"
                                />
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white py-2 px-4 rounded-full"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">No user data found.</div>
                )}
            </div>
        </div>
    );
};

export default EditAccount;
