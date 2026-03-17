import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit?: number;
  setLimit?: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({ page, setPage, totalPages, limit, setLimit }: Props) {
  const limitOptions = [10, 25, 50, 100];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {setLimit && (
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              className="bg-white border border-gray-200 rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none cursor-pointer"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>per page</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <button
          title="Previous"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          title="Next"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
