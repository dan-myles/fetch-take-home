import { Kalam } from "next/font/google";
import { columns } from "./_components/columns";
import { PaginatedDataTable } from "./_components/paginated-data-table";

const kalam = Kalam({ subsets: ["latin"], weight: "400" });

const Page = () => {
  return (
    <main className="flex-grow items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto mt-[-80px]">
        <div className="px-6 py-4">
          <h2
            className={`${kalam.className} text-3xl font-normal italic text-gray-700 text-center mb-4 transform mb-[-8px]`}
          >
            Dogs Available For Adoption
          </h2>
        </div>
        <div className="overflow-hidden rounded-xl shadow-xl bg-white">
          <PaginatedDataTable
            columns={columns}
            initialSearchParams={{
              sort: "breed:asc",
              size: "10",
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
