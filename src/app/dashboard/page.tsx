"use client";

import { Kalam } from "next/font/google";

const kalam = Kalam({ subsets: ["latin"], weight: "400" });

const Page = () => {
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
          <table className="min-w-full table-auto">
            <thead className="bg-purple-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Breed
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody
              className="overflow-y-scroll block"
              style={{ height: "400px" }}
            >
              {Array.from({ length: 15 }).map((_, index) => (
                <tr
                  key={index}
                  className="hover:bg-purple-50 block"
                  style={{ width: "100%" }}
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 block"
                    style={{ width: "20%" }}
                  >
                    Buddy {index + 1}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 block"
                    style={{ width: "20%" }}
                  >
                    Golden Retriever
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 block"
                    style={{ width: "20%" }}
                  >
                    3
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 block"
                    style={{ width: "20%" }}
                  >
                    Male
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 block"
                    style={{ width: "20%" }}
                  >
                    $499.99
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Page;
