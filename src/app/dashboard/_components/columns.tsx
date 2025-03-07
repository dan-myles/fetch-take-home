"use client";

import { Dog } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Dog>[] = [
  {
    accessorKey: "img",
    header: () => (
      <div className="text-2xl">🦮</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <div className="w-32 h-32 relative">
            <img
              src={row.getValue("img")}
              alt="Dog"
              className="rounded-md object-cover w-full h-full shadow-sm"
            />
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="font-semibold text-gray-900 text-center">Name</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium text-base text-center">
          {row.getValue("name")}
        </div>
      )
    }
  },
  {
    accessorKey: "age",
    header: () => (
      <div className="font-semibold text-gray-900 text-center">Age</div>
    ),
    cell: ({ row }) => {
      const age = row.getValue("age") as number;
      return (
        <div className="text-sm text-center">
          {age} {age === 1 ? "year" : "years"} old
        </div>
      )
    }
  },
  {
    accessorKey: "zip_code",
    header: () => (
      <div className="font-semibold text-gray-900 text-center">Zip Code</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-gray-600 text-center">
          {row.getValue("zip_code")}
        </div>
      )
    }
  },
  {
    accessorKey: "breed",
    header: () => (
      <div className="font-semibold text-gray-900 text-center">Breed</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium text-center">
          {row.getValue("breed")}
        </div>
      )
    }
  },
];
