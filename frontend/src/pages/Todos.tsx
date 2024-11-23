import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const TodosPage: FC = () => {
  const { token, onLogout: handleLogout } = useAuth();
  const api = useApi();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onLogout = async () => {
    try {
      await api.logout(token);
      navigate("/login");
    } catch (e) {
      if (e instanceof Error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: e.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Unknown error:",
          description: String(e),
        });
      }
    } finally {
      handleLogout();
    }
  };
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="absolute right-4 top-4 flex space-x-2 md:right-8 md:top-8">
          <Button onClick={onLogout} variant="ghost">
            Logout
          </Button>
          <ModeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Todos</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodosPage;
