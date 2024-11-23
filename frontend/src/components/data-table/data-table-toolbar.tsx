import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";

import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { Category } from "@/schema";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  categories: Category[];
}

export function DataTableToolbar<TData>({
  table,
  categories,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isCompletedValues = [
    {
      value: "true",
      label: "Completed",
    },
    {
      value: "false",
      label: "To do",
    },
  ];
  const categoriesOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter todos..."
          value={
            (table.getColumn("description")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("is_completed") && (
          <DataTableFacetedFilter
            column={table.getColumn("is_completed")}
            title="Is Completed?"
            options={isCompletedValues}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Categories"
            options={categoriesOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
