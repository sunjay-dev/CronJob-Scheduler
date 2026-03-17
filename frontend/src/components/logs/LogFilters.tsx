import { ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface LogFiltersProps {
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  methodFilter: string;
  setMethodFilter: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
}

export function LogFilters({ statusFilter, setStatusFilter, methodFilter, setMethodFilter, setPage }: LogFiltersProps) {
  const statusOptions = ["success", "failed"];
  const methodOptions = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
      <div className="relative group">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-white border border-gray-200 text-gray-900 text-sm shadow-xs rounded-lg pl-3 pr-8 py-1.5 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative group">
        <select
          value={methodFilter}
          onChange={(e) => {
            setMethodFilter(e.target.value);
            setPage(1);
          }}
          className="bg-white border border-gray-200 text-gray-900 text-sm shadow-xs rounded-lg pl-3 pr-8 py-1.5 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">All Methods</option>
          {methodOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
