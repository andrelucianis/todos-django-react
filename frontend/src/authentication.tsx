import { PropsWithChildren, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/authentication";
import { useAuth } from "@/hooks/use-auth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const token = localStorage.getItem("token") ?? "";
  const [auth, setAuth] = useState({
    token,
    onLogin: (token: string) => {
      localStorage.setItem("token", token);
      setAuth({ ...auth, token });
    },
    onLogout: () => {
      localStorage.removeItem("token");
      setAuth({ ...auth, token: "" });
    },
  });

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const AuthProtected = ({ children }: PropsWithChildren<unknown>) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
