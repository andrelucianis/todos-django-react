import { ThemeProvider } from "@/components/theme-provider";
import { ApiProvider } from "./api";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ApiProvider baseUrl={import.meta.env.VITE_APP_API_URL!}>
        <h1>Todos App</h1>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
