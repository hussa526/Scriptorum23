export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: string;
    avatar: string;
}