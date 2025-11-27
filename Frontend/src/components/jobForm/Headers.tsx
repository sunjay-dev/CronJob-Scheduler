import { Plus, Trash2 } from "lucide-react";
import type { JobDetails } from '../../types'

interface Props {
    jobDetails: JobDetails;
    setJobDetails: React.Dispatch<React.SetStateAction<JobDetails>>;
}

export default function Headers({ jobDetails, setJobDetails }: Props) {

    const addHeader = () => {
        setJobDetails(pre => (
            {
                ...pre,
                headers: [...pre.headers, { key: '', value: '' }]
            }
        ));
    };

    const deleteHeader = (index: number) => {
        setJobDetails(pre => ({
            ...pre, headers: pre.headers.filter((_, i) => i !== index)
        }));
    };

    const updateHeader = (index: number, field: "key" | "value", value: string) => {
        setJobDetails(pre => {
            const updated = [...pre.headers];
            updated[index] = { ...updated[index], [field]: value };
            return {...pre, headers: updated};
        });
    };

    return (
        <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
            <div className="flex flex-col space-y-6">
                <label className="font-medium text-gray-700">Headers</label>
                <div className="px-3 space-y-4">
                    {jobDetails.headers.length === 0 ? (
                        <p className="text-gray-500 italic text-sm border-b border-gray-400 pb-1">No custom headers defined.</p>
                    ) : (
                        jobDetails.headers.map((header, index) => (
                            <div key={index} className='grid grid-row-[1fr_1fr_0.2fr] items-center sm:grid-cols-[1fr_1fr_0.2fr] gap-4 border-b border-gray-300 pb-2'>
                                <input
                                    onChange={e => updateHeader(index, "key", e.target.value)}
                                    value={header.key}
                                    placeholder='Key'
                                    className='border-b-1 border-gray-400 bg-gray-200 rounded-t p-2.5 focus:outline-none focus:border-purple-500 transition'
                                    type="text"
                                />
                                <input
                                    value={header.value}
                                    onChange={e => updateHeader(index, "value", e.target.value)}
                                    placeholder='Value'
                                    className='border-b-1 border-gray-400 bg-gray-200 rounded-t p-2.5 focus:outline-none focus:border-purple-500 transition'
                                    type="text"
                                />

                                <button title="delete" onClick={() => deleteHeader(index)} type="button" className='flex items-center justify-center active:scale-[0.98]'>
                                    <Trash2 className='w-5 h-5' />
                                </button>
                            </div>
                        ))
                    )}

                    <div className="flex justify-end p-2">
                        <button
                            title="add"
                            onClick={addHeader}
                            type='button'
                            className='flex gap-1 shadow items-center font-light text-gray-700 bg-gray-200 px-2 py-1.5 rounded'
                        >
                            <Plus className='w-4.5 h-4.5' /> ADD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
