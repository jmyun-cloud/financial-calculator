"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (userData: User) => void;
    logout: () => void;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        // Load auth state from localStorage
        const storedUser = localStorage.getItem("fc_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("fc_user", JSON.stringify(userData));
        setShowLoginModal(false);
        // Notify other components (legacy event for compatibility)
        window.dispatchEvent(new Event("fc_mock_login"));
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("fc_user");
        // Notify other components
        window.dispatchEvent(new Event("fc_mock_logout"));
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, showLoginModal, setShowLoginModal }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
