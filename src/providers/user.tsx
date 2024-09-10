'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import User from '@/types/user';

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const updateUser = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    return (
        <UserContext.Provider value={{ user, setUser: updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
