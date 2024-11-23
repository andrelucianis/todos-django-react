import { ThemeProvider } from "@/components/theme-provider";
import { ApiProvider } from "./api";
import { AuthProvider } from "./authentication";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ApiProvider baseUrl={import.meta.env.VITE_APP_API_URL!}>
        <AuthProvider>
          <h1>Todos App</h1>
        </AuthProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
