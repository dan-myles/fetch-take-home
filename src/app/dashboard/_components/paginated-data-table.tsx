"use client";

import {  dogBreeds } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { api, DogSearchParams } from "@/lib/api";
import { Dog } from "@/lib/types";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Search,
  X,
} from "lucide-react";

interface PaginatedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function PaginatedDataTable<TData, TValue>({
  columns,
}: PaginatedDataTableProps<TData, TValue>) {
  const [data, setData] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSizeOptions = [5, 10, 20, 50];
  const [pageSize, setPageSize] = useState(10);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    totalPages: 0,
    totalResults: 0,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState<{ min?: number; max?: number }>(
    {},
  );
  const [breedFilter, setBreedFilter] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useState<DogSearchParams>({
    size: pageSize.toString(),
    from: "0",
    sort: "breed:asc",
  });

  const hasActiveFilters =
    sorting.length > 0 ||
    searchQuery.trim() !== "" ||
    Object.keys(ageFilter).length > 0 ||
    breedFilter.length > 0;

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => {
    setSorting((old) => {
      const newState = typeof updater === "function" ? updater(old) : updater;

      if (newState.length === 0 && old.length > 0) {
        return [{ ...old[0], desc: !old[0].desc }];
      }

      return newState;
    });
  };

  const handleClearFilters = () => {
    setSorting([]);
    setSearchQuery("");
    setAgeFilter({});
    setBreedFilter([]);
    setSearchParams({
      ...searchParams,
      sort: "breed:asc",
      from: "0",
      breeds: undefined,
      ageMin: undefined,
      ageMax: undefined,
    });
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
    setSearchParams({
      ...searchParams,
      from: "0",
    });
  };

  const handleAgeFilterChange = (min?: number, max?: number) => {
    const newAgeFilter = {
      ...(min !== undefined ? { min } : {}),
      ...(max !== undefined ? { max } : {}),
    };
    setAgeFilter(newAgeFilter);

    setPagination({
      ...pagination,
      pageIndex: 0,
    });

    setSearchParams({
      ...searchParams,
      from: "0",
      ...(min !== undefined ? { ageMin: min } : {}),
      ...(max !== undefined ? { ageMax: max } : {}),
    });
  };

  const handleBreedFilterChange = (breed: string, checked: boolean) => {
    const newBreedFilter = checked
      ? [...breedFilter, breed]
      : breedFilter.filter((b) => b !== breed);

    setBreedFilter(newBreedFilter);

    setPagination({
      ...pagination,
      pageIndex: 0,
    });

    setSearchParams({
      ...searchParams,
      from: "0",
      breeds: newBreedFilter.length > 0 ? newBreedFilter : undefined,
    });
  };

  useEffect(() => {
    if (sorting.length > 0) {
      const [sortColumn] = sorting;
      const apiSortField = sortColumn.id as "age" | "breed" | "name";
      const apiSortDirection = sortColumn.desc ? "desc" : "asc";

      if (apiSortField) {
        setSearchParams((prev) => ({
          ...prev,
          sort: `${apiSortField}:${apiSortDirection}`,
          from: "0",
        }));

        setPagination((prev) => ({
          ...prev,
          pageIndex: 0,
        }));
      }
    }
  }, [sorting]);

  const fetchDogs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching with params:", searchParams);

      const searchResult = await api.dogs.search(searchParams);
      console.log("Search result:", searchResult);

      if (searchResult.resultIds.length > 0) {
        const dogsData = await api.dogs.get({ ids: searchResult.resultIds });
        setData(dogsData as unknown as Dog[]);

        setPagination({
          ...pagination,
          totalResults: searchResult.total,
          totalPages: Math.ceil(searchResult.total / pageSize),
        });
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
    const nextPageIndex = pagination.pageIndex + 1;
    const nextFrom = nextPageIndex * pageSize;

    console.log(`Moving to next page: ${nextPageIndex}, from: ${nextFrom}`);

    setSearchParams({
      ...searchParams,
      from: nextFrom.toString(),
    });

    setPagination({
      ...pagination,
      pageIndex: nextPageIndex,
    });
  };

  const handlePrevPage = () => {
    if (pagination.pageIndex > 0) {
      const prevPageIndex = pagination.pageIndex - 1;
      const prevFrom = prevPageIndex * pageSize;

      console.log(
        `Moving to previous page: ${prevPageIndex}, from: ${prevFrom}`,
      );

      setSearchParams({
        ...searchParams,
        from: prevFrom.toString(),
      });

      setPagination({
        ...pagination,
        pageIndex: prevPageIndex,
      });
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);

    setPageSize(newPageSize);
    setPagination({
      ...pagination,
      pageIndex: 0,
      totalPages: Math.ceil(pagination.totalResults / newPageSize),
    });

    setSearchParams({
      ...searchParams,
      size: newPageSize.toString(),
      from: "0",
    });
  };

  const table = useReactTable({
    data: data as unknown as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize,
      },
      sorting,
    },
    manualPagination: true,
    pageCount: pagination.totalPages,
    manualSorting: true,
  });

  const startItem = pagination.pageIndex * pageSize + 1;
  const endItem = Math.min(
    (pagination.pageIndex + 1) * pageSize,
    pagination.totalResults,
  );

  return (
    <div className="rounded-md  overflow-hidden">
      {error && (
        <div className="bg-red-50 p-4 text-red-700 text-center">{error}</div>
      )}

      {/* Search and Filter Section */}
      <section className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search dogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 w-full md:w-[250px]"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="ml-2 h-10 bg-purple-300 text-black hover:bg-transparent"
            >
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Age Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 flex items-center gap-1 bg-purple-300 text-black hover:bg-transparent"
                >
                  <Filter className="h-4 w-4" />
                  Age
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter by Age</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-age">Min Age</Label>
                      <Input
                        id="min-age"
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={ageFilter.min || ""}
                        onChange={(e) =>
                          handleAgeFilterChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                            ageFilter.max,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-age">Max Age</Label>
                      <Input
                        id="max-age"
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={ageFilter.max || ""}
                        onChange={(e) =>
                          handleAgeFilterChange(
                            ageFilter.min,
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Breed Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 flex items-center gap-1 bg-purple-300 text-black hover:bg-transparent"
                >
                  <Filter className="h-4 w-4" />
                  Breed
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter by Breed</h4>
                  <div className="space-y-2 max-h-[200px] overflow-auto">
                    {dogBreeds.map((breed) => (
                      <div key={breed} className="flex items-center space-x-2">
                        <Checkbox
                          id={`breed-${breed}`}
                          checked={breedFilter.includes(breed)}
                          onCheckedChange={(checked) =>
                            handleBreedFilterChange(breed, checked === true)
                          }
                        />
                        <Label htmlFor={`breed-${breed}`}>{breed}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="h-10 text-xs flex items-center bg-purple-100 text-black hover:bg-transparent"
              >
                <X className="h-3 w-3 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {ageFilter.min !== undefined && (
              <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                Min Age: {ageFilter.min}
                <button
                  onClick={() =>
                    handleAgeFilterChange(undefined, ageFilter.max)
                  }
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {ageFilter.max !== undefined && (
              <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                Max Age: {ageFilter.max}
                <button
                  onClick={() =>
                    handleAgeFilterChange(ageFilter.min, undefined)
                  }
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {breedFilter.map((breed) => (
              <div
                key={breed}
                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
              >
                Breed: {breed}
                <button
                  onClick={() => handleBreedFilterChange(breed, false)}
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {sorting.length > 0 && (
              <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                Sort: {sorting[0].id} {sorting[0].desc ? "↓" : "↑"}
              </div>
            )}
          </div>
        )}
      </section>

      <div className="overflow-auto max-h-[59.5vh] relative rounded-xl bg-white">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 shadow-xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();

                  return (
                    <TableHead
                      key={header.id}
                      className="bg-purple-100 py-4 text-center px-6"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center justify-center ${
                            isSortable ? "cursor-pointer select-none" : ""
                          }`}
                          onClick={
                            isSortable
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          {isSortable && (
                            <div className="ml-2">
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
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
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {pagination.totalResults > 0 ? (
              <>
                Showing {startItem} to {endItem} of {pagination.totalResults}{" "}
                dogs
              </>
            ) : (
              "No dogs found"
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={pagination.pageIndex === 0 || loading}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={
              pagination.pageIndex >= pagination.totalPages - 1 || loading
            }
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
