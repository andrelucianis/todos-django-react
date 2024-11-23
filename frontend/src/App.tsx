import { ThemeProvider } from "@/components/theme-provider";
import { ApiProvider } from "./api";
import { AuthProtected, AuthProvider } from "./authentication";
import { Toaster } from "./components/ui/toaster";
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import TodosPage from "./pages/Todos";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ApiProvider baseUrl={import.meta.env.VITE_APP_API_URL!}>
        <AuthProvider>
          <BrowserRouter basename="/todos-django-react/">
            <Routes>
              <Route
                path="/register"
                element={
                  <Suspense>
                    <AuthPage variant="register" />
                  </Suspense>
                }
              />
              <Route
                path="/login"
                element={
                  <Suspense>
                    <AuthPage variant="login" />
                  </Suspense>
                }
              />
              <Route
                path="/todos"
                element={
                  <AuthProtected>
                    <Suspense>
                      <TodosPage />
                    </Suspense>
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
