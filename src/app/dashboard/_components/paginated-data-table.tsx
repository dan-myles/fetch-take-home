"use client";

import { Dog, dogBreeds } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { api, DogSearchParams } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { createColumns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function PaginatedDataTable() {
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
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);

  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [isMatchLoading, setIsMatchLoading] = useState(false);

  const [searchParams, setSearchParams] = useState<DogSearchParams>({
    size: pageSize.toString(),
    from: "0",
    sort: "breed:asc",
  });

  const columns = createColumns({
    favoriteDogs,
    onToggleFavorite: handleToggleFavorite,
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

  const fetchDogs = async (abortSignal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching with params:", searchParams);
      const searchResult = await api.dogs.search(searchParams, abortSignal);
      console.log("Search result:", searchResult);

      // Check if the request was aborted
      if (abortSignal?.aborted) return;

      if (searchResult.resultIds.length > 0) {
        const dogsData = await api.dogs.get({ ids: searchResult.resultIds }, abortSignal);

        // Check again if the request was aborted
        if (abortSignal?.aborted) return;

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
      // Don't set error if the request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }

      setError("Failed to fetch dogs. Please try again.");
      console.error(err);
    } finally {
      if (!abortSignal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchDogs(abortController.signal);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]);

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
    const newSize = parseInt(value);
    setPageSize(newSize);

    setPagination({
      ...pagination,
      pageIndex: 0,
    });

    setSearchParams({
      ...searchParams,
      from: "0",
      size: newSize.toString(),
    });
  };

  // Handle toggling dog favorites (max 5)
  function handleToggleFavorite(dogId: string) {
    setFavoriteDogs((prev) => {
      if (prev.includes(dogId)) {
        return prev.filter((id) => id !== dogId);
      }

      if (prev.length >= 5) {
        return prev;
      }

      return [...prev, dogId];
    });
  }

  // Handle finding a match from favorited dogs
  const handleFindMatch = async () => {
    if (favoriteDogs.length === 0) return;

    setIsMatchLoading(true);
    try {
      const matchResult = await api.dogs.match({ ids: favoriteDogs });

      if (matchResult.match) {
        const matchedDogData = await api.dogs.get({ ids: [matchResult.match] });
        if (matchedDogData && matchedDogData.length > 0) {
          setMatchedDog(matchedDogData[0] as Dog);
          setIsMatchDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("Error finding a match:", error);
    } finally {
      setIsMatchLoading(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    state: {
      sorting,
    },
    manualPagination: true,
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
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left side: Search and Find Match */}
            <div className="flex flex-wrap items-center gap-2">
              {favoriteDogs.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFindMatch}
                  disabled={isMatchLoading}
                  className="relative group h-8"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>Find Match</span>
                  {/* Sparkle effect */}
                  <span className="absolute inset-0 rounded-md overflow-hidden">
                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-yellow-400/0 via-yellow-400/30 to-yellow-400/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></span>
                  </span>
                  <Separator orientation="vertical" className="mx-4" />
                  {/* How many dogs are favorited */}
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-gray-700">
                    {favoriteDogs.length}
                  </span>
                  {isMatchLoading && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              )}

              {/* Clear favorites button */}
              {favoriteDogs.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFavoriteDogs([])}
                  className=" bg-transparent text-black hover:bg-red-300"
                >
                  <X className="h-4 w-" />
                </Button>
              )}

              {/* Find Match Button - Only show when dogs are favorited */}
              {favoriteDogs.length === 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFindMatch}
                      disabled={isMatchLoading}
                      className="bg-gray-200 cursor:not-allowed text-gray-500 hover:bg-gray-200"
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Find Match</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      Favorite some dogs to find a match!
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Right side: Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Age Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-purple-300 text-black hover:bg-purple-200"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Age
                    {Object.keys(ageFilter).length > 0 && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter by Age</h4>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="ageMin">Min</Label>
                        <Input
                          id="ageMin"
                          type="number"
                          min={0}
                          placeholder="Min age"
                          value={ageFilter.min ?? ""}
                          onChange={(e) =>
                            setAgeFilter({
                              ...ageFilter,
                              min: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </div>
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="ageMax">Max</Label>
                        <Input
                          id="ageMax"
                          type="number"
                          min={0}
                          placeholder="Max age"
                          value={ageFilter.max ?? ""}
                          onChange={(e) =>
                            setAgeFilter({
                              ...ageFilter,
                              max: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleAgeFilterChange(ageFilter.min, ageFilter.max)
                      }
                      className="bg-purple-300 text-black hover:bg-purple-200"
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Breed Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-purple-300 text-black hover:bg-purple-200"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Breed
                    {breedFilter.length > 0 && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter by Breed</h4>
                    <div className="space-y-2 max-h-[200px] overflow-auto">
                      {dogBreeds.map((breed) => (
                        <div
                          key={breed}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`breed-${breed}`}
                            checked={breedFilter.includes(breed)}
                            onCheckedChange={(checked) =>
                              handleBreedFilterChange(breed, checked === true)
                            }
                          />
                          <Label
                            htmlFor={`breed-${breed}`}
                            className="text-sm font-normal"
                          >
                            {breed}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 bg-purple-300 text-black hover:bg-purple-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1 mt-2">
              {searchQuery.trim() !== "" && (
                <div className="flex items-center bg-purple-100 text-xs rounded-full px-2 py-1">
                  <span className="mr-1">Search: {searchQuery}</span>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchParams({
                        ...searchParams,
                        from: "0",
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {breedFilter.map((breed) => (
                <div
                  key={breed}
                  className="flex items-center bg-purple-100 text-xs rounded-full px-2 py-1"
                >
                  <span className="mr-1">{breed}</span>
                  <button
                    onClick={() => handleBreedFilterChange(breed, false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {Object.keys(ageFilter).length > 0 && (
                <div className="flex items-center bg-purple-100 text-xs rounded-full px-2 py-1">
                  <span className="mr-1">
                    Age: {ageFilter.min !== undefined ? ageFilter.min : "0"}
                    {ageFilter.max !== undefined ? ` - ${ageFilter.max}` : "+"}
                  </span>
                  <button
                    onClick={() => handleAgeFilterChange(undefined, undefined)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {sorting.length > 0 && (
                <div className="flex items-center bg-purple-100 text-xs rounded-full px-2 py-1">
                  <span className="mr-1">
                    Sort: {sorting[0].id} {sorting[0].desc ? "↓" : "↑"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
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

      {/* Match Dialog */}
      <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Your Perfect Match!
            </DialogTitle>
          </DialogHeader>
          {matchedDog && (
            <div className="flex flex-col items-center space-y-4 p-4">
              <div className="w-full h-64 relative rounded-lg overflow-hidden">
                <Image
                  src={matchedDog.img}
                  alt={matchedDog.name}
                  className="w-full h-full object-cover"
                  width={640}
                  height={640}
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{matchedDog.name}</h3>
                <p className="text-gray-600">{matchedDog.breed}</p>
                <p className="text-gray-600">
                  {matchedDog.age} {matchedDog.age === 1 ? "year" : "years"} old
                </p>
                <p className="text-gray-600">Zip Code: {matchedDog.zip_code}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
