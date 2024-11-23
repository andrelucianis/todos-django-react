import { Row, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { Todo } from "@/schema";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

interface DataTableToggleIsCompletedProps {
  row: Row<Todo>;
  table: Table<Todo>;
}

export function DataTableToggleIsCompleted({
  row,
  table,
}: DataTableToggleIsCompletedProps) {
  const { token } = useAuth();
  const api = useApi();
  const { toast } = useToast();
  const todo = row.original;

  const onToggle = async () => {
    try {
      await api.update(token!, Number(todo.id), undefined, !todo.is_completed);
      table.options.meta?.toggleIsCompleted(row.index);
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
    <div className="flex justify-center">
      <Button
        variant="outline"
        className="rounded-full border-secondary"
        onClick={onToggle}
      >
        {todo.is_completed ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Circle className="h-4 w-4 text-blue-500" />
        )}
      </Button>
    </div>
  );
}
