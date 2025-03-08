"use client";

import { Dog } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ColumnProps {
  favoriteDogs: string[];
  onToggleFavorite: (dogId: string) => void;
}

export const createColumns = ({
  favoriteDogs,
  onToggleFavorite,
}: ColumnProps): ColumnDef<Dog>[] => [
  {
    accessorKey: "favorite",
    header: () => (
      <div className="font-semibold text-gray-900 text-center">Favorite</div>
    ),
    cell: ({ row }) => {
      const dogId = row.original.id;
      const isFavorited = favoriteDogs.includes(dogId);
      const atMaxFavorites = favoriteDogs.length >= 5 && !isFavorited;

      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(dogId)}
            disabled={atMaxFavorites}
            className={`h-8 w-8 ${isFavorited ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"} ${atMaxFavorites ? "cursor-not-allowed opacity-50" : ""}`}
            title={
              atMaxFavorites
                ? "Maximum of 5 favorites reached"
                : isFavorited
                  ? "Remove from favorites"
                  : "Add to favorites"
            }
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "img",
    header: () => <div className="text-2xl">🦮</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <div className="w-24 h-24 relative">
            <Image
              src={row.getValue("img")}
              alt="Dog"
              className="rounded-md object-cover w-full h-full shadow-sm"
              width={240}
              height={240}
            />
          </div>
        </div>
      );
    },
    enableSorting: false,
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
      );
    },
    enableSorting: true,
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
      );
    },
    enableSorting: true,
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
      );
    },
    enableSorting: false,
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
      );
    },
    enableSorting: true,
  },
];
