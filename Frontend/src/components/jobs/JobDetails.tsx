import React, { useState } from 'react';
import type { JobCardProps } from '../../types';
import { CheckCircle, FileText, PauseCircle, Pencil, Trash2, X, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfirmMenu } from '../common';

interface Props {
    details: JobCardProps;
    setOpenDetailsMenu: React.Dispatch<React.SetStateAction<boolean>>;
    timeFormat24?: boolean;
}

export default function JobDetails({ details, setOpenDetailsMenu, timeFormat24 }: Props) {

    const [confirmDelete, setConfirmDelete] = useState(false);
    const closeDetails = () => setOpenDetailsMenu(false);

    const formattedTime_NextRunAt = new Date(details.nextRunAt).toLocaleTimeString('en-US', {
        hour12: !timeFormat24,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const formattedTime_LastRunAt = new Date(details.lastRunAt).toLocaleTimeString('en-US', {
        hour12: !timeFormat24,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">

            <div className="bg-white max-w-3xl w-full px-8 py-7 rounded-xl shadow-sm border border-gray-200 relative">


                <button
                    onClick={closeDetails}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
                >
                    <X size={24} />
                </button>


                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{details.jobName} </h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed job configuration</p>
                    </div>


                    <span className={`px-4 mr-2 py-1.5 text-xs rounded-full font-medium border
                        ${details.disabled
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                    >
                        {details.disabled ? "Disabled" : "Enabled"}
                    </span>
                </div>


                <div className="border-t border-gray-200 my-6"></div>


                <div className="grid grid-cols-2 gap-6">


                    <div>
                        <p className="text-xs font-medium text-gray-800 uppercase tracking-wide mb-1">
                            Method & URL
                        </p>
                        <p
                            title={details.url}
                            className="text-gray-500 lowercase max-w-[95%] whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            <span className="uppercase font-semibold text-purple-500">
                                {details.method}
                            </span> • {details.url}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-800 uppercase tracking-wide mb-1">
                            Last Execution
                        </p>
                        {details.lastRunAt ? (
                            <span className="text-gray-500">{formattedTime_LastRunAt}</span>
                        ) : (
                            <span className="text-gray-400">—</span>
                        )}
                    </div>

                    
                    <div>
                        <p className="text-xs font-medium text-gray-800 uppercase tracking-wide mb-1">
                            Next Execution
                        </p>
                        {details.disabled ? (
                            <span className="flex items-center gap-1 text-gray-400 italic">
                                <PauseCircle className="w-4 h-4" /> Paused
                            </span>
                        ) : (
                            <span className="text-gray-500">{formattedTime_NextRunAt}</span>
                        )}
                    </div>

                </div>

             
                <div className="border-t border-gray-200 my-8"></div>

                
                <div className="grid grid-cols-2 gap-4">

                    <Link
                        to={`/job/${details._id}/logs`}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg 
                                   bg-purple-500 hover:bg-purple-800 text-white transition"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">History</span>
                    </Link>

                    <Link
                        to={`/job/${details._id}/edit`}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg 
                                   bg-blue-500 hover:bg-blue-700 text-white transition"
                    >
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit Job</span>
                    </Link>

                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg 
                                   bg-red-500 hover:bg-red-700 text-white transition"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                    </button>

                    {details.disabled ? (
                        <button
                            onClick={() => details.handleChangeStatus(details._id, true)}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-lg 
                                       bg-green-500 hover:bg-green-700 text-white transition"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Enable Job</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => details.handleChangeStatus(details._id, false)}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-lg 
                                       bg-orange-500 hover:bg-orange-700 text-white transition"
                        >
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Disable Job</span>
                        </button>
                    )}

                </div>

                {confirmDelete && (
                    <ConfirmMenu
                        title="Confirm Deletion"
                        message="Are you sure you want to delete this job?"
                        confirmText="Yes, Delete"
                        confirmColor="bg-red-500 hover:bg-red-700 text-white"
                        onConfirm={() => {
                            details.handleDeleteJob(details._id);
                            setConfirmDelete(false);
                        }}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
            </div>
        </div>
    );
}
