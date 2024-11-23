import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Row, Table } from "@tanstack/react-table";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Category, Todo } from "@/schema";

interface DataTableCategoriesOptionsProps {
  row: Row<Todo>;
  table: Table<Todo>;
  categories: Category[];
}

export function DataTableCategoriesOptions({
  row,
  table,
  categories,
}: DataTableCategoriesOptionsProps) {
  const handleCheckedChange = (checked: boolean, category: Category) => {
    // Get all the categories from the row, and add or remove the category changed
    const newCategories = checked
      ? [...row.original.category, category]
      : row.original.category.filter((cat: Category) => cat.id !== category.id);
    // Call API to update the row with the new categories
    table.options.meta?.updateTodoCategories(row.index, newCategories);
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={categories.length === 0}>
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[150px]">
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={row.original.category.some(
                (cat: Category) => cat.id === category.id
              )}
              onCheckedChange={(value) => handleCheckedChange(value, category)}
            >
              {category.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
