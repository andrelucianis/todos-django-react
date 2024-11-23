import { ThemeProvider } from "@/components/theme-provider";
import { ApiProvider } from "./api";
import { AuthProtected, AuthProvider } from "./authentication";
import AuthPage from "./pages/Auth";
import { Toaster } from "./components/ui/toaster";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TodosPage from "./pages/Todos";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ApiProvider baseUrl={import.meta.env.VITE_APP_API_URL!}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/register"
                element={
                  <React.Suspense>
                    <AuthPage variant="register" />
                  </React.Suspense>
                }
              />
              <Route
                path="/login"
                element={
                  <React.Suspense>
                    <AuthPage variant="login" />
                  </React.Suspense>
                }
              />
              <Route
                path="/todos"
                element={
                  <AuthProtected>
                    <React.Suspense>
                      <TodosPage />
                    </React.Suspense>
                  </AuthProtected>
                }
              />
              <Route path="*" element={<Navigate to="/todos" />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
