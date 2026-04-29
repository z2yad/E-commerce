export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    avatar?: string | null;
    createdAt?: string;
}

export interface UserProfile extends User {
    phone?: string | null;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    isEmailVerified?: boolean;
    orderCount?: number;
}
