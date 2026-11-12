import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type User = { name: string; phone: string };

type AuthContextValue = {
    user: User | null; // null — гость
    login: (user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    function login(newUser: User) {
        setUser(newUser);
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth должен вызываться внутри AuthProvider");
    }
    return context;
}