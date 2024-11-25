import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';

import { User } from '@/interface/User';
import EditAccount from '@/components/user/EditAccount';
import Account from '@/components/user/User';

interface UserUpdate {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
}

const UserPage = () => {
    const auth = useContext(AuthContext);

    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [isEditingAccount, setIsEditingAccount] = useState(false);

    // Simulate fetching user data (replace this with actual API call)
    useEffect(() => {
        const fetchUser = async () => {
            if (auth?.username && auth?.token) {
                try {
                // Replace with your actual API endpoint for fetching user templates
                const response = await fetch(`/api/auth/${auth.username}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                    }
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch templates");
                }
    
                const data = await response.json();
                console.log(data);
                setUser(data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    // setLoading(false); // Set loading to false in case of an error
                } finally {
                    setLoading(false);
                }
            }
            };
    
        fetchUser();
    }, [auth]);

    const handleEditUser = () => {
        setIsEditingAccount(true);
    };

    const saveEditUser = async ({ firstName, lastName, email, phone, avatar } : UserUpdate) => {
        if (!email || !firstName || !lastName) {
            alert("Please fill in all the fields.");
            return;
        }
    
            // You can implement an API call here to update user data
        const updatedUser = { firstName, lastName, email, phone, avatar };

        try {
            const response = await fetch(`/api/auth/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                throw new Error("Failed to update account.");
            }
    
            const data = await response.json();
            console.log('User updated successfully:', data);
    
            setUser(data);

            auth?.update(data.username, data.avatar);
            
            router.push(`/user/${data.username}`);
        } catch (error) {
            console.error("Error saving account:", error);
        }
        setIsEditingAccount(false);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            {!isEditingAccount ? (
                <Account 
                    user={user}
                    loading={loading}
                    handleEditUser={handleEditUser}
                />
            ) : (
                <EditAccount
                    saveEditUser={saveEditUser}
                />
            )}
        </div>
    );
};

export default UserPage;
