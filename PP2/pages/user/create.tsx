import { useState, useContext, use } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';

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

const CreateAccount = () => {
    const router = useRouter();
    const auth = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('default.png');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const createAccount = async () => {
        if (!username || !password || !email || !firstName || !lastName || !avatar) {
            console.log(firstName, lastName, username, password, email, avatar, phone);
            alert("Please fill in all the fields.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const newUser = { firstName, lastName, username, password, email, avatar, phone };
        console.log(firstName, lastName, username, password, email, avatar, phone);

        try {
            const response = await fetch(`/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newUser, password }),
            });

            if (!response.ok) {
                throw new Error("Failed to create account.");
            }

            const data = await response.json();
            console.log('Account created successfully:', data);

            auth?.update(data.username, data.avatar);

            const res = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error("Failed to create account.");
            }

            const result = await res.json();
            auth?.login(result.token, result.id.toString(), result.username, result.avatar, result.role);

            // auth?.login();

            router.push(`/user/${data.username}`);
        } catch (error) {
            console.error("Error creating account:", error);
        }
    };

    const handleAvatarSelect = (selectedAvatar: string) => {
        console.log(selectedAvatar);
        setAvatar(selectedAvatar);
        setShowPopup(false);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Create Account</h2>

                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : (
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
                                        placeholder="Username"
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
                                    placeholder="First Name"
                                    className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full"
                                />
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                    className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full mt-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Phone</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Phone Number"
                                    className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Password</label>
                                <div className="flex items-center">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="ml-2 text-blue-500"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                                <div className="flex items-center">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        className="text-lg font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <button
                                onClick={createAccount}
                                className="bg-blue-500 text-white py-2 px-4 rounded-full"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateAccount;
