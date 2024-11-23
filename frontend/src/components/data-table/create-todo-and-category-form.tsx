import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, Todo } from "@/schema";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";

type CreateTodoAndCategoryFormProps = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  categories: Category[];
};

export function CreateTodoAndCategoryForm({
  setTodos,
  setCategories,
  categories,
}: CreateTodoAndCategoryFormProps) {
  const { token } = useAuth();
  const api = useApi();
  const { toast } = useToast();
  const [todoDescription, setTodoDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const onAddTodo = async () => {
    try {
      const newTodo = await api.create(token!, todoDescription);
      setTodos((todos) => [...todos, newTodo]);
      setTodoDescription(""); // Clear the input after adding the todo
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

  const onAddCategory = async () => {
    try {
      const newCategory = await api.createCategory(token!, categoryName);
      setCategories((categories) => [...categories, newCategory]);
      setCategoryName(""); // Clear the input after adding the category
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

  const onDeleteCategory = async (category: Category) => {
    try {
      await api.deleteCategory(token!, Number(category.id));
      setCategories((categories) =>
        categories.filter((c) => c.id !== category.id)
      );
      setTodos((todos) =>
        todos.map((todo) => ({
          ...todo,
          category: todo.category.filter(
            (cat: Category) => cat.id !== category.id
          ),
        }))
      );
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
    <div className="flex items-start">
      <div className="flex flex-1 items-center space-x-4 w-1/2">
        <Input
          placeholder="I need to..."
          value={todoDescription}
          onChange={(e) => setTodoDescription(e.target.value)}
          className="h-10 w-[150px] lg:w-[250px]"
        />
        <Button className="h-10 text-md" onClick={onAddTodo}>
          Add Todo
        </Button>
      </div>
      <div className="w-1/2">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Categories</h2>
        <div className="flex flex-1 items-center space-x-4">
          <Input
            placeholder="E.g. Work, Personal, etc."
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="h-10 w-[150px] lg:w-[250px]"
          />
          <Button
            className="h-10 text-md"
            onClick={onAddCategory}
            variant={"outline"}
          >
            Add Category
          </Button>
        </div>
        <div className="flex flex-wrap my-4 max-h-md max-w-lg overflow-y-auto">
          {categories.length === 0 ? (
            <p>No categories found</p>
          ) : (
            categories.map((category: Category) => {
              return (
                <Badge
                  key={category.id}
                  variant={"secondary"}
                  className="text-md flex items-center justify-center px-2 py-1 ml-1 mt-1"
                >
                  <span>{category.name}</span>
                  <Trash
                    className="ml-2 h-4 w-4 text-red-500 cursor-pointer"
                    onClick={() => onDeleteCategory(category)}
                  />
                </Badge>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
