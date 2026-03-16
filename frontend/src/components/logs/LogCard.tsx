import { useState } from "react";
import { CheckCircle, XCircle, Clock, EllipsisVertical } from "lucide-react";
import LogDetails from "./LogDetails";
import type { UserLogInterface } from "../../types";

export default function LogCard({ log, timeFormat24 }: { log: UserLogInterface; timeFormat24?: boolean }) {
  const [openDetailsMenu, setOpenDetailsMenu] = useState<boolean>(false);
  const isSuccess = log.status === "success";
  const formattedTime = new Date(log.createdAt).toLocaleTimeString("en-US", {
    hour12: !timeFormat24,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <>
      <tr className="flex items-center justify-between gap-4 bg-white p-4 mb-2 rounded-md border border-gray-200 text-sm sm:table-row sm:mb-0 sm:border-b sm:rounded-none sm:p-0 sm:hover:bg-gray-50">
        <td className="sm:table-cell sm:px-6 sm:py-4 order-2 sm:order-none">
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium uppercase">{log.method}</span>
        </td>
        <td
          title={log.url}
          className="sm:table-cell sm:px-6 sm:py-4 order-1 sm:order-none truncate flex-1 sm:w-auto max-w-[150px] sm:max-w-xs text-gray-700"
        >
          {log.url}
        </td>

        <td title={formattedTime} className="hidden sm:table-cell sm:px-6 sm:py-4 text-gray-500 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>
        </td>

        <td
          className={`flex sm:table-cell sm:px-6 sm:py-4 sm:order-none order-first items-center gap-1 font-medium truncate ${isSuccess ? "text-green-600" : "text-red-600"}`}
        >
          {isSuccess ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Success</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">Failed</span>
            </div>
          )}
        </td>

        <td className="sm:table-cell sm:px-6 sm:py-4 order-last sm:order-none text-right">
          <button
            title="View Log Details"
            onClick={() => setOpenDetailsMenu(true)}
            className="flex ml-auto gap-1 items-center justify-center sm:border sm:border-gray-300 sm:hover:bg-gray-100 sm:rounded sm:px-2 sm:py-1"
          >
            <EllipsisVertical className="h-4 w-4" />
            <span className="hidden sm:block">DETAILS</span>
          </button>
          {openDetailsMenu && <LogDetails details={log} setOpenDetailsMenu={setOpenDetailsMenu} timeFormat24={timeFormat24} />}
        </td>
      </tr>
    </>
  );
}
