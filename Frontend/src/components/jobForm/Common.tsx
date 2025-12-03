import Cron from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { Copy, HelpCircle } from 'lucide-react';
import type { JobDetails } from '../../types'
import type { UseFormRegister, Control, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Controller } from "react-hook-form";
import { ToggleSwitch } from '../common';

interface Props {
  register: UseFormRegister<JobDetails>;
  control: Control<JobDetails>;
  watch: UseFormWatch<JobDetails>;
  errors: FieldErrors<JobDetails>;
  emailNotifications: boolean | undefined;
}

export default function Common({ register, control, watch, errors, emailNotifications }: Props) {

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

        {/* Toggles */}

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <ToggleSwitch control={control} name="enabled" />
            <label htmlFor="switch-job-enabled" className="font-medium text-gray-700">
              Enable job
            </label>
          </div>

          {/* Enable Email */}
          <div className="flex items-center gap-2">
            <ToggleSwitch control={control} name="email" disabled={!emailNotifications} />
            <label htmlFor="switch-email-enabled" className="font-medium text-gray-700">
              Enable email
            </label>

            {!emailNotifications && (
              <div className="relative group">
                <HelpCircle
                  size={18}
                  className="text-gray-500 cursor-pointer hover:text-purple-600"
                />
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-48 text-xs text-white bg-gray-800 
                            rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-all 
                            pointer-events-none z-10 text-center">
                  Email notifications are disabled in your settings.
                </div>
              </div>
            )}
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