"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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

import { Button } from "@/components/ui/button";
import { api, DogSearchParams } from "@/lib/api";
import { Dog } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PaginatedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialSearchParams?: DogSearchParams;
}

export function PaginatedDataTable<TData, TValue>({
  columns,
  initialSearchParams = {},
}: PaginatedDataTableProps<TData, TValue>) {
  const [data, setData] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
    totalPages: 0,
    totalResults: 0,
  });

  const [searchParams, setSearchParams] = useState<DogSearchParams>({
    ...initialSearchParams,
    size: "10",
    from: "0",
    sort: "breed:asc",
  });
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);

  const fetchDogs = async () => {
    setLoading(true);
    setError(null);
    try {
      // First search for dog IDs
      const searchResult = await api.dogs.search(searchParams);

      // Then fetch the actual dog data
      if (searchResult.resultIds.length > 0) {
        const dogsData = await api.dogs.get({ ids: searchResult.resultIds });
        setData(dogsData as unknown as Dog[]);

        // Update pagination info
        setPagination({
          ...pagination,
          totalResults: searchResult.total,
          totalPages: Math.ceil(searchResult.total / Number(searchParams.size)),
        });

        // Store next/prev cursors for pagination
        setNextCursor(searchResult.next);
        setPrevCursor(searchResult.prev);
      } else {
        setData([]);
      }
    } catch (err) {
      setError("Failed to fetch dogs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, [searchParams]);

  const handleNextPage = () => {
    if (nextCursor) {
      setSearchParams({
        ...searchParams,
        from: nextCursor,
      });
      setPagination({
        ...pagination,
        pageIndex: pagination.pageIndex + 1,
      });
    }
  };

  const handlePrevPage = () => {
    if (prevCursor) {
      setSearchParams({
        ...searchParams,
        from: prevCursor,
      });
      setPagination({
        ...pagination,
        pageIndex: pagination.pageIndex - 1,
      });
    }
  };

  const table = useReactTable({
    data: data as unknown as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
  });

  return (
    <div className="rounded-md border overflow-hidden">
      {error && (
        <div className="bg-red-50 p-4 text-red-700 text-center">{error}</div>
      )}

      <div className="overflow-auto max-h-[70vh] relative">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-purple-100 py-4 text-center px-6"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading dogs...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  No dogs found. Try adjusting your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-gray-500">
          Showing{" "}
          {data.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0}{" "}
          to {pagination.pageIndex * pagination.pageSize + data.length} of{" "}
          {pagination.totalResults} dogs
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={!prevCursor || loading}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!nextCursor || loading}
            className="h-8"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

