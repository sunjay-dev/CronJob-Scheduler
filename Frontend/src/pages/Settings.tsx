import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setAuth } from '../slices/authSlice';
import type { User, UserWithoutEmail } from '../types';
import { ConfirmMenu, Loader, Preference } from '../components';
import { useConfirmExit } from '../hooks/useConfirmExit';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema } from '../schemas/authSchemas';

export default function SettingsPage() {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  const { register, handleSubmit, control, getValues, formState: { isDirty, isSubmitting, isSubmitted, errors } } = useForm<UserWithoutEmail>(
    {
      values: user ? {
        name: user.name,
        timezone: user.timezone,
        emailNotifications: user.emailNotifications,
        pushAlerts: user.pushAlerts,
        mode: user.mode,
        timeFormat24: user.timeFormat24
      } : undefined,
      resolver: zodResolver(settingsSchema),
    }
  );

  useConfirmExit(isDirty, !isSubmitted && !isSubmitting);

  const handleSaveChanges = () => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(getValues())
    }).then(async (res) => {
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Something went wrong, Please try again later.");

      return data;
    })
      .then(data => {
        const userDetails: User = data.user;
        dispatch(setAuth({
          user: {
            name: userDetails.name,
            email: userDetails.email,
            timezone: userDetails.timezone,
            mode: userDetails.mode,
            timeFormat24: userDetails.timeFormat24,
            emailNotifications: userDetails.emailNotifications,
            pushAlerts: userDetails.pushAlerts
          }
        }));
      })
      .catch(err => console.error(err))
  }

  if (!user) return <div>Loading user info...</div>;

  return (
    <>
      {isSubmitting && <Loader />}
      <h1 className="text-3xl text-purple-600 mb-6">Settings</h1>

      <form onSubmit={e => {
        e.preventDefault();
        setConfirmUpdate(true);
      }} className="space-y-10 bg-white p-6 rounded-xl shadow mb-4">

        <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6'>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Full Name</label>
              <input
                {...register("name", { required: true })}
                type="text"
                className="w-full mt-1 rounded-md px-3 py-2 border transition bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full mt-1 bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <Preference control={control} />

        <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6'>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className=" text-gray-700">Email Notifications</span>
              <Controller name="emailNotifications"
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

            <div className="flex items-center justify-between">
              <span className=" text-gray-700">Push Alerts</span>

              <Controller name="pushAlerts"
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
        <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6 flex flex-col'>
          <label className="text-lg font-semibold text-gray-800 mb-4">Default Timezone</label>

          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <select
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Karachi">Asia/Karachi</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
              </select>
            )} />
        </div>

        <div className="text-right">
          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form >
      {confirmUpdate &&
        <ConfirmMenu
          title="Confirm Changes"
          message="Are you sure you want to update your account settings?"
          confirmText="Yes, Update"
          confirmColor="bg-purple-500 hover:bg-purple-700 text-white"
          onConfirm={() => {
            handleSubmit(handleSaveChanges)();
            setConfirmUpdate(false);
          }}
          onCancel={() => setConfirmUpdate(false)}
        />
      }
    </>
  );
}