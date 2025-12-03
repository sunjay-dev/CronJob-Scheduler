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
      <div className="flex items-center justify-between gap-4 bg-white p-4 mb-2 rounded-md border border-gray-200 text-sm whitespace-nowrap">
        <div className="sm:order-none order-2 overflow-hidden">
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium uppercase">{log.method}</span>
        </div>
        <span title={log.url} className=" sm:order-none order-1 truncate flex-1/4 sm:flex-none text-gray-700">
          {log.url}
        </span>

        <div title={formattedTime} className="hidden sm:flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{formattedTime}</span>
        </div>

        <div className={`flex sm:order-none order-first items-center gap-1 font-medium truncate ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {isSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:block">Success</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="hidden sm:block">Failed</span>
            </>
          )}
        </div>

        <button
          title="View Log Details"
          onClick={() => setOpenDetailsMenu(true)}
          className="flex order-last gap-1 items-center justify-center sm:border sm:border-gray-300 sm:hover:bg-gray-100 sm:rounded sm:p-1"
        >
          <EllipsisVertical className="h-4 w-4" />
          <span className="hidden sm:block">DETAILS</span>
        </button>
      </div>

      {openDetailsMenu && <LogDetails details={log} setOpenDetailsMenu={setOpenDetailsMenu} timeFormat24={timeFormat24} />}
    </>
  );
}
