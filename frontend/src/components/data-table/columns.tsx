import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Circle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Category, Todo } from "@/schema";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableDeleteRow } from "@/components/data-table/data-table-delete-row";
import { DataTableToggleIsCompleted } from "@/components/data-table/data-table-toggle-is-completed";
import { DataTableCategoriesOptions } from "@/components/data-table/data-table-categories-options";

const isCompletedValues = [
  { value: true, label: "Completed", icon: CheckCircle },
  { value: false, label: "To do", icon: Circle },
];

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: "is_completed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Completed?" />
    ),
    cell: ({ row }) => {
      const isCompleted = isCompletedValues.find(
        (isCompleted) => isCompleted.value === row.getValue("is_completed")
      );

      if (!isCompleted) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {isCompleted.icon && (
            <isCompleted.icon
              className={`mr-2 h-4 w-4 ${
                isCompleted.value ? "text-green-500" : "text-blue-500"
              }`}
            />
          )}
          <span>{isCompleted.label}</span>
        </div>
      );
    },
    filterFn: (row, _, value) => {
      return value.includes(String(row.getValue("is_completed")));
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Todo" />
    ),
  },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categories" />
    ),
    cell: ({ row }) => {
      const categories: Category[] = row.getValue("category");

      if (!categories || categories.length === 0) {
        return null;
      }
      return (
        <div className="flex items-center">
          {categories.map((category: Category) => {
            return (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            );
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as Category[];
      return rowValue.some((category) => value.includes(category.id));
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created:" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formattedDate = format(date, "PPpp");
      return <div>{formattedDate}</div>;
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.created_at.localeCompare(rowB.original.created_at);
    },
  },
  {
    id: "toggleIsCompleted",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Toggle Status" />
      </div>
    ),
    cell: ({ row, table }) => (
      <DataTableToggleIsCompleted row={row} table={table} />
    ),
  },
  {
    id: "delete",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Delete" />
      </div>
    ),
    cell: ({ row, table }) => {
      return <DataTableDeleteRow row={row} table={table} />;
    },
  },
];

export const manageCategoriesColumn = (
  categories: Category[]
): ColumnDef<Todo> => ({
  id: "manageCategories",
  header: ({ column }) => (
    <div className="flex justify-center">
      <DataTableColumnHeader column={column} title="Manage Categories" />
    </div>
  ),
  cell: ({ row, table }) => (
    <DataTableCategoriesOptions
      row={row}
      table={table}
      categories={categories}
    />
  ),
});
