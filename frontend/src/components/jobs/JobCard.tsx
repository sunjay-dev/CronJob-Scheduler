import { Pencil, FileText, MoreVertical, PauseCircle, EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ConfirmMenu } from "../common";
import type { JobCardProps } from "../../types";
import ActionMenu from "./ActionMenu";

export default function JobCard(job: JobCardProps) {
  const { _id, jobName, method, url, nextRunAt, lastRunAt, disabled = false, handleDeleteJob, handleChangeStatus, timeFormat24 } = job;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const formattedNextRun = nextRunAt ? new Date(nextRunAt).toLocaleString("en-US", { hour12: !timeFormat24 }) : "-";
  const formattedLastRun = lastRunAt ? new Date(lastRunAt).toLocaleString("en-US", { hour12: !timeFormat24 }) : "-";

  useEffect(() => {
    const handler = (e: PointerEvent | TouchEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target as Node) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <>
      {/* Desktop */}

      <div className="bg-white border border-gray-300 rounded-lg p-4 hidden sm:grid grid-cols-[2.5fr_1.5fr_1.5fr_1fr_1fr_1fr_40px] items-center text-sm gap-4 relative cursor-pointer">
        <div className="overflow-hidden">
          <h2 title={jobName} className="font-semibold text-gray-800 truncate">
            {jobName}
          </h2>
          <p title={url} className="text-gray-500 lowercase truncate">
            <span className="uppercase">{method}</span> • {url}
          </p>
        </div>

        <div className="truncate text-gray-700">{formattedLastRun}</div>

        {disabled ? (
          <span className="flex items-center gap-1 text-gray-400 italic">
            <PauseCircle className="w-4 h-4" /> Paused
          </span>
        ) : (
          <div className="truncate text-gray-700">{formattedNextRun}</div>
        )}

        <div className="text-center">
          <span className={`text-xs px-2 py-0.5 rounded-full ${disabled ? "text-red-700 bg-red-100" : "text-green-700 bg-green-100"}`}>
            {disabled ? "Disabled" : "Enabled"}
          </span>
        </div>

        <Link to={`/job/${_id}/edit`} title="Edit Job" className="hover:text-purple-500">
          <button className="flex items-center gap-1 hover:underline">
            <Pencil className="w-4 h-4" /> Edit
          </button>
        </Link>

        <Link to={`/job/${_id}/logs`} title="View Job Logs" className="hover:text-purple-500">
          <button className="flex items-center gap-1 hover:underline">
            <FileText className="w-4 h-4" /> History
          </button>
        </Link>

        <div className="relative text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="px-1 py-1.5 rounded hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div ref={desktopMenuRef} className="absolute right-0 z-50 mt-2 w-36">
              <ActionMenu
                setConfirmDelete={setConfirmDelete}
                setOpen={setMenuOpen}
                handleChangeStatus={handleChangeStatus}
                _id={_id}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>

      {/* Moblie */}

      <div className="bg-white sm:hidden border border-gray-300 rounded-lg p-4 text-sm space-y-3 relative">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 truncate">{jobName}</h2>

          <div className="flex items-center gap-3 relative">
            <span className={`text-xs px-2 py-0.5 rounded-full ${disabled ? "text-red-700 bg-red-100" : "text-green-700 bg-green-100"}`}>
              {disabled ? "Disabled" : "Enabled"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <EllipsisVertical className="w-5 h-5 text-gray-700" />
            </button>

            {menuOpen && (
              <div ref={mobileMenuRef} className="absolute top-full right-0 z-50 mt-2 w-40">
                <ActionMenu
                  setConfirmDelete={setConfirmDelete}
                  setOpen={setMenuOpen}
                  handleChangeStatus={handleChangeStatus}
                  _id={_id}
                  disabled={disabled}
                />
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-500 truncate lowercase">
          <span className="uppercase">{method}</span> • {url}
        </p>

        <div className="border-t border-gray-200" />

        <div className="flex justify-between text-gray-500 text-xs">
          <span>Last Run</span>
          <span>Next Run</span>
        </div>

        <div className="flex justify-between text-gray-800 text-sm font-medium">
          <span>{formattedLastRun}</span>
          <span className="text-end">{disabled ? "Paused" : formattedNextRun}</span>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmMenu
          title="Confirm Deletion"
          message="Are you sure you want to delete this job?"
          confirmText="Yes, Delete"
          confirmColor="bg-red-500 hover:bg-red-700 text-white"
          onConfirm={() => {
            handleDeleteJob(_id);
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
