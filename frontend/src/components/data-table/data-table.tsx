import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Category, Todo } from "@/schema";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateDescription: (
      rowIndex: number,
      columnId: string,
      value: unknown
    ) => void;
    updateTodoCategories: (rowIndex: number, value: Category[]) => void;
    deleteRow: (rowIndex: number) => void;
    toggleIsCompleted: (rowIndex: number) => void;
  }
}

interface DataTableProps {
  columns: ColumnDef<Todo>[];
  tableData: Todo[];
  setTableData: React.Dispatch<React.SetStateAction<Todo[]>>;
  categories: Category[];
  handleUpdateDescription: (
    id: number,
    description: string
  ) => Promise<void | Error>;
  handleUpdateTodoCategories: (
    id: number,
    categories: number[]
  ) => Promise<void | Error>;
}

export function DataTable({
  columns,
  tableData,
  setTableData,
  categories,
  handleUpdateDescription,
  handleUpdateTodoCategories,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const defaultColumn: Partial<ColumnDef<Todo>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      const [value, setValue] = React.useState(initialValue);
      const onBlur = () => {
        table.options.meta?.updateDescription(index, id, value);
      };
      React.useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="h-8 w-[150px] lg:w-[250px] border-none rounded-sm"
        />
      );
    },
  };

  function useSkipper() {
    const shouldSkipRef = React.useRef(true);
    const shouldSkip = shouldSkipRef.current;

    const skip = React.useCallback(() => {
      shouldSkipRef.current = false;
    }, []);

    React.useEffect(() => {
      shouldSkipRef.current = true;
    });

    return [shouldSkip, skip] as const;
  }
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: tableData,
    columns,
    defaultColumn,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      updateDescription: async (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        const rowId = tableData[rowIndex].id;
        try {
          await handleUpdateDescription(Number(rowId), value as string);
          setTableData((old) =>
            old.map((row, index) => {
              if (index === rowIndex) {
                return {
                  ...old[rowIndex]!,
                  [columnId]: value,
                };
              }
              return row;
            })
          );
        } catch (e) {
          console.error(e);
          setTableData((old) =>
            old.map((row, index) => {
              if (index === rowIndex) {
                return {
                  ...old[rowIndex],
                };
              }
              return row;
            })
          );
        }
      },
      updateTodoCategories: async (rowIndex, value) => {
        skipAutoResetPageIndex();
        const rowId = tableData[rowIndex].id;
        const newCategoryIds = value.map((cat: Category) => Number(cat.id));
        try {
          await handleUpdateTodoCategories(Number(rowId), newCategoryIds);
          setTableData((old) =>
            old.map((row, index) => {
              if (index === rowIndex) {
                return {
                  ...old[rowIndex]!,
                  category: value,
                };
              }
              return row;
            })
          );
        } catch (e) {
          console.error(e);
          setTableData((old) =>
            old.map((row, index) => {
              if (index === rowIndex) {
                return {
                  ...old[rowIndex],
                };
              }
              return row;
            })
          );
        }
      },
      deleteRow: (rowIndex) => {
        skipAutoResetPageIndex();
        setTableData((old) => old.filter((_, index) => index !== rowIndex));
      },
      toggleIsCompleted: (rowIndex) => {
        skipAutoResetPageIndex();
        setTableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                is_completed: !old[rowIndex]!.is_completed,
              };
            }
            return row;
          })
        );
      },
    },
    autoResetPageIndex,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} categories={categories} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
