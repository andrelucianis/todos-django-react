import { createContext } from "react";

export type AuthHandler = {
    onLogin: (token: string) => void;
    onLogout: () => void;

    token: string;
};

export const AuthContext = createContext<AuthHandler>({
    onLogin: () => { },
    onLogout: () => { },
    token: "",
});