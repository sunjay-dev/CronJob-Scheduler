import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
    page: number;
    totalPages: number;
    setPage:React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({page, setPage, totalPages}: Props) {
  return (
    <div className="flex justify-end mt-6">
  <div className="flex items-center gap-2 text-sm">
    <button
      onClick={() => setPage(prev => prev - 1)}
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
      onClick={() => setPage(prev => prev + 1)}
      disabled={page >= totalPages}
      className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>
  )
}
