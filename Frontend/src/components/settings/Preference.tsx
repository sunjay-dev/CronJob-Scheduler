import { Controller, type Control } from 'react-hook-form';
import type { UserWithoutEmail } from '../../types'

interface Props {
  control: Control<UserWithoutEmail>;
}
export default function Preference({ control }: Props) {

  return (
    <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6'>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className=" text-gray-700">Dark Mode</span>

          <Controller name="mode"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(field.value === "day" ? "dark" : "day")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${field.value === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${field.value === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            )} />
        </div>

        <div className="flex items-center justify-between">
          <span className=" text-gray-700">24-Hour Time Format</span>
          <Controller name="timeFormat24"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${field.value ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${field.value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            )} />
        </div>
      </div>
    </div>
  )
}
