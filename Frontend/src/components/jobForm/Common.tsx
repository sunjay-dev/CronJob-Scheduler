import Cron from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { Copy } from 'lucide-react';
import type { JobDetails } from '../../types'
import type { UseFormRegister, Control, UseFormWatch, ErrorOption } from 'react-hook-form';
import { Controller } from "react-hook-form";

interface Props {
  register: UseFormRegister<JobDetails>;
  control: Control<JobDetails>;
  watch: UseFormWatch<JobDetails>;
  errors: any;
}

export default function Common({ register, control, watch, errors }: Props) {

  return (
    <>
      <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">

        <div className="text-base flex flex-col space-y-1">
          <label htmlFor="name" className="font-medium text-gray-700">Job Name</label>
          <input {...register("name", { required: true })}
            type="text"
            required
            id="name"
            placeholder="e.g. Ping API"
            className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
          />
          {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="url" className="font-medium text-gray-700">Target URL</label>
          <input
            type="url"
            id="url"
            required
            placeholder="https://example.com/api"
            {...register("url", { required: true })}
            className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
          />
          {errors.url && (
          <p className="text-red-500 text-sm">{errors.url.message}</p>
        )}
        </div>

        <div className="flex items-center gap-3">
          <div className='flex items-center gap-2'>
            <Controller name='enabled' control={control} 
            render={({field}) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${field.value ? 'bg-purple-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${field.value ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            )}
            />
            <label className="font-medium text-gray-700">Enable job</label>
          </div>
          <div className='flex items-center gap-2'>
            <Controller name="email"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${field.value ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${field.value ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              )}
            />
            <label className="font-medium text-gray-700">Enable email</label>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
        <div className="flex flex-col space-y-3">
          <label className="font-medium text-gray-700">Schedule <span className="text-red-500">*</span></label>
          <div className="overflow-x-auto whitespace-nowrap">
            <Controller name="cron" control={control}
              render={({ field }) => (
                <Cron
                  value={field.value}
                  setValue={field.onChange}
                  clearButton={false}
                  className="!w-full"
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1 mt-4">
          <div className="flex items-center justify-between">
            <label htmlFor="cron" className="font-medium text-gray-700">Cron Expression</label>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(watch("cron"))}
              className="text-gray-500 hover:text-purple-600 transition"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            id='cron'
            value={watch("cron")}
            readOnly
            className="text-center border-0 border-b-2 border-gray-400 bg-transparent px-1 py-1 font-mono text-gray-700 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>
    </>
  );
}

