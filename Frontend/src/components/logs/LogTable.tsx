import { FileWarning } from "lucide-react";
import type { UserLogInterface } from "../../types";
import { useAppSelector } from "../../hooks";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import LogCard from "./LogCard";
import type { Dispatch, SetStateAction } from "react";

interface LogTableProps {
    logs: UserLogInterface[];
    isLoading: boolean;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    totalPages: number;
    emptyMessage?: string;
}

export default function LogTable({
    logs,
    isLoading,
    page,
    setPage,
    totalPages,
    emptyMessage = "No logs found.",
}: LogTableProps) {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <>
            <div className="flex sm:hidden justify-between text-sm items-center text-gray-500 font-medium pl-1 sm:px-4 mb-2">
                <span className="sm:order-none order-2 sm:mr-4 mr-2">Method</span>
                <span className="text-center mr-4 sm:order-none order-1 sm:text-left flex-1/3 sm:flex-none">URL</span>
                <span className="hidden sm:block mr-4">Time</span>
                <span className="order-first sm:order-none mr-4">Status</span>
                <span className="order-last">Actions</span>
            </div>

            {isLoading ? (
                <Loader />
            ) : logs.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm flex flex-col items-center">
                    <FileWarning className="w-8 h-8 mb-3 text-gray-400" />
                    <p>{emptyMessage}</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-hidden -mx-4 sm:mx-0 px-6 sm:px-0">
                        <table className="min-w-full text-left text-sm text-gray-500">
                            <thead className="hidden sm:table-header-group border-b border-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-medium">Method</th>
                                    <th scope="col" className="px-6 py-3 font-medium">URL</th>
                                    <th scope="col" className="px-6 py-3 font-medium">Time</th>
                                    <th scope="col" className="px-6 py-3 font-medium">Status</th>
                                    <th scope="col" className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 border-t border-gray-100 bg-transparent sm:bg-white">
                                {logs.map((log) => (
                                    <LogCard key={log._id} log={log} timeFormat24={user?.timeFormat24} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                </>
            )}
        </>
    );
}
