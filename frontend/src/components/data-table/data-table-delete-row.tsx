import { Row, Table } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Todo } from "@/schema";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

interface DataTableDeleteRowProps {
  row: Row<Todo>;
  table: Table<Todo>;
}

export function DataTableDeleteRow({ row, table }: DataTableDeleteRowProps) {
  const { token } = useAuth();
  const api = useApi();
  const { toast } = useToast();
  const todo = row.original;

  const onDelete = async () => {
    try {
      await api.delete(token!, Number(todo.id));
      table.options.meta?.deleteRow(row.index);
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
      <Button variant="ghost" onClick={onDelete}>
        <Trash className="text-primary" />
        <span className="sr-only">Delete todo {todo.id}</span>
      </Button>
    </div>
  );
}
