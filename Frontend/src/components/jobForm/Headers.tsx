import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from "lucide-react";

import type { JobDetails } from '../../types'
import type { UseFormRegister, Control } from 'react-hook-form';

interface Props {
  register: UseFormRegister<JobDetails>;
  control: Control<JobDetails>;
}

export default function Headers({ register, control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "headers"
  });

  return (
    <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-6">
        <label className="font-medium text-gray-700">Headers <span className="text-red-500">*</span></label>
        <div className="px-3 space-y-4">
          {fields.length === 0 ? (
            <p className="text-gray-500 italic text-sm border-b border-gray-400 pb-1">
              No custom headers defined.
            </p>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className='grid items-center grid-cols-[1fr_1fr_0.2fr] gap-4 border-b border-gray-300 pb-2'>
                <input
                  {...register(`headers.${index}.key` as const)}
                  placeholder='Key'
                  className='border-b-1 border-gray-400 bg-gray-200 rounded-t p-2.5 focus:outline-none focus:border-purple-500 transition'
                  type="text"
                />
                <input
                  {...register(`headers.${index}.value` as const)}
                  placeholder='Value'
                  className='border-b-1 border-gray-400 bg-gray-200 rounded-t p-2.5 focus:outline-none focus:border-purple-500 transition'
                  type="text"
                />

                <button
                  title="delete"
                  type="button"
                  onClick={() => remove(index)}
                  className='flex items-center justify-center active:scale-[0.98]'
                >
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>
            ))
          )}

          <div className="flex justify-end p-2">
            <button
              title="add"
              type='button'
              onClick={() => append({ key: "", value: "" })}
              className='flex gap-1 shadow items-center font-light text-gray-700 bg-gray-200 px-2 py-1.5 rounded'
            >
              <Plus className='w-4.5 h-4.5' /> ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
