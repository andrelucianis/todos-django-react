import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { Todo, Category } from "@/schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import {
  columns,
  manageCategoriesColumn,
} from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { CreateTodoAndCategoryForm } from "@/components/data-table/create-todo-and-category-form";

const TodosPage: React.FC = () => {
  const { token, onLogout: handleLogout } = useAuth();
  const api = useApi();
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const allColumns = [...columns, manageCategoriesColumn(categories)];

  useEffect(() => {
    const fetchData = async () => {
      const todos = await api.list(token!);
      const categories = await api.listCategories(token!);
      setTodos(todos.results);
      setCategories(categories.results);
    };
    fetchData();
  }, [token, api]);

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

  const onUpdateDescription = async (
    id: number,
    description: string
  ): Promise<void | Error> => {
    try {
      await api.update(token!, id, description, undefined);
    } catch (e) {
      if (e instanceof Error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: e.message,
        });
        throw e;
      } else {
        toast({
          variant: "destructive",
          title: "Unknown error:",
          description: String(e),
        });
      }
    }
  };

  const onUpdateTodoCategories = async (id: number, categories: number[]) => {
    try {
      await api.updateTodoCategories(token!, id, categories);
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
        <CreateTodoAndCategoryForm
          setTodos={setTodos}
          setCategories={setCategories}
          categories={categories}
        />
        <Separator />
        <p className="text-muted-foreground">
          Here&apos;s the list of todos you need to complete. Let&apos;s get
          things done!
        </p>
        <DataTable
          tableData={todos}
          setTableData={setTodos}
          columns={allColumns}
          categories={categories}
          handleUpdateDescription={onUpdateDescription}
          handleUpdateTodoCategories={onUpdateTodoCategories}
        />
      </div>
    </>
  );
};

export default TodosPage;
