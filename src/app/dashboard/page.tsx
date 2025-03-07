"use client";

import { api, DogSearchResult } from "@/lib/api";
import { Dog } from "@/lib/types";
import { Kalam } from "next/font/google";
import { useEffect, useState } from "react";

const kalam = Kalam({ subsets: ["latin"], weight: "400" });

const Page = () => {
  const [data, setData] = useState<Dog[]>();
  // DMD-OZUBBPFf4ZNZzBtw
  // EMD-OZUBBPFf4ZNZzBtw

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.dogs.get({ ids: ["DMD-OZUBBPFf4ZNZzBtw"] });
      setData(data);
      console.log("data: ", data);
    };

    fetchData();
  }, []);

  return (
    <main className="flex-grow flex items-center justify-center mt-[-64px]">
      <div className="w-full max-w-5xl">
        <div className="px-6 py-4">
          <h2
            className={`${kalam.className} text-3xl font-normal italic text-gray-700 text-center mb-4 transform rotate-[-4deg] tracking-wider`}
          >
            Dogs Available For Adoption
          </h2>
        </div>
        <div className="overflow-hidden  rounded-xl shadow-xl">
          {/* */}

          {data?.map((dog, idx) => (
            <div
              key={idx}
              className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl" role="img" aria-label="Dog emoji">
                  🐶
                </span>
                <span className="font-bold text-2xl text-gray-800">
                  {dog.name}
                </span>
                <img
                  src={dog.img}
                  alt={dog.name}
                  className="w-16 h-16 rounded-full"
                />
              </div>
            </div>
          ))}

          {/* */}
        </div>
      </div>
    </main>
  );
};

export default Page;
