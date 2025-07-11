import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type User = { token: string; username: string };
type Context = {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
};

const UserContext = createContext<Context | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); 

    // Load from localStorage on initial mount
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);
    // Login system
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            });

            if (!response.ok) return false;

            const data = await response.json();
            const userData = {
                token: data.token,
                username: data.username,
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        } catch (err) {
            console.error('Login failed:', err);
            return false;
        }
    }
    //logs user out
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useAuth = (): Context => {
    const context = useContext(UserContext);
    if (context === undefined) throw new Error('useAuth must be inside AuthProvider');
    return context;
};