import { useEffect } from 'react';
import type { JobDetails } from '../../types'
import Headers from './Headers'
import type { UseFormRegister,  UseFormWatch, UseFormSetValue, Control } from 'react-hook-form';

interface Props {
 register: UseFormRegister<JobDetails>;
  watch: UseFormWatch<JobDetails>;
  setValue: UseFormSetValue<JobDetails>;
  control: Control<JobDetails>;
}

export default function Advanced({ control, register, watch, setValue }: Props) {

  const methodValue = watch("method");
  const allowBody = ["POST", "PUT", "PATCH"].includes(methodValue?.toUpperCase());

  useEffect(() => {
    if (!allowBody)
      setValue("body", "")

  }, [allowBody, setValue])

  return (
    <>
      <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
        <div className="text-base flex flex-col space-y-2">
          <div className="flex flex-col space-y-2">
            <label htmlFor="method" className="font-medium text-gray-700">HTTP Method</label>
            <select
              {...register("method", { required: true })}
              required 
              id='method'
              className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>HEAD</option>
              <option>OPTIONS</option>
              <option>PATCH</option>
              <option>TRACE</option>
            </select>
          </div>

          <label htmlFor="body" className="font-medium text-gray-700">Request Body</label>
          <textarea
            rows={4}
            id='body'
            required
            {...register("body", { required: true })}
            disabled={!allowBody}
            className="border border-gray-300 resize-none rounded px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <Headers register={register} control={control} />

      <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="timezone" className="font-medium text-gray-700">Timezone</label>
          <select
            required
            id='timezone'
            {...register("timezone", { required: true })}
            className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
          >
            <option value="UTC">UTC</option>
            <option value="Asia/Karachi">Asia/Karachi</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="timeout" className="font-medium text-gray-700">Timeout (seconds)</label>
          <input
            type="number"
            min={1}
            max={30}
            defaultValue={30}
            id='timeout'
            required
            {...register("timeout", { required: true, valueAsNumber: true })}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              if (parseInt(target.value) > 30) target.value = "30";
              if (parseInt(target.value) < 1) target.value = "1";
            }}
            className="border-0 border-b-2 border-gray-400 px-3 py-2 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>
    </>
  );
}


