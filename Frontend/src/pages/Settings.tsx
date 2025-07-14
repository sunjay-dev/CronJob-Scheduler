import { useEffect, useState } from 'react';
import { Preference } from '../components';
import { Pencil, Save } from "lucide-react";
import { useAppDispatch, useAppSelector } from '../hooks';
import { setAuth } from '../slices/authSlice';
import type { User } from '../types';
import ConfirmModal from '../components/ConfirmMenu';

export default function SettingsPage() {
  const user = useAppSelector(state => state.auth.user);
  const [isEditingName, setIsEditingName] = useState(false);
  const dispatch = useAppDispatch();
  const [confirmUpdate, setConfirmUpdate] = useState(false)
  const [details, setDetails] = useState<User>({
    name: '',
    email: '',
    timezone: 'UTC',
    emailNotifications: true,
    pushAlerts: true,
    mode: "day",
    timeFormat24: true
  });

  useEffect(() => {
    if (user) {
      setDetails({
        name: user.name,
        email: user.email,
        timezone: user.timezone,
        emailNotifications: user.emailNotifications,
        pushAlerts: user.pushAlerts,
        mode: user.mode,
        timeFormat24: user.timeFormat24
      })
    }
  }, [user]);

  const handleSaveChanges = () => {

    fetch(`${import.meta.env.VITE_BACKEND_URL}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(details)
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);

      if (!res.ok)
        throw new Error(data.message || "Something went wrong");

      return data;
    })
      .then(data => {
        const userDetails: User = data.user;
        setDetails(userDetails);
        console.log(userDetails);
        console.log(details);
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
        }))
      })
      .catch(err => console.log(err))
  }

  if (!user) return <div>Loading user info...</div>;


  return (
    <>
      <h1 className="text-3xl text-purple-600 mb-6">Settings</h1>

      <form onSubmit={e => {
        e.preventDefault();
        setConfirmUpdate(true);
      }} className="space-y-10 bg-white p-6 rounded-xl shadow">

        <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6'>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full Name</label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={details.name}
                    onChange={e => setDetails({ ...details, name: e.target.value })}
                    readOnly={!isEditingName}
                    className={`flex-1 rounded-md px-3 py-2 border transition text-sm
      ${isEditingName
                        ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingName(!isEditingName)}
                    className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded hover:text-purple-600 transition"
                    title={isEditingName ? "Lock" : "Edit Name"}
                  >
                    {isEditingName ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block  font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={details.email}
                  readOnly
                  className="w-full mt-1 bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        <Preference details={details} setDetails={setDetails} />

        <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6'>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className=" text-gray-700">Email Notifications</span>
              <button
                type="button"
                onClick={() => setDetails({ ...details, emailNotifications: !details.emailNotifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${details.emailNotifications ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${details.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className=" text-gray-700">Push Alerts</span>
              <button
                type="button"
                onClick={() => setDetails({ ...details, pushAlerts: !details.pushAlerts })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${details.pushAlerts ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${details.pushAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
        <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6 flex flex-col'>
          <label className="text-lg font-semibold text-gray-800 mb-4">Timezone</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={details.timezone}
            onChange={e => setDetails({ ...details, timezone: e.target.value })}
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

        <div className="text-right">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form >
      {confirmUpdate &&
        <ConfirmModal
          title="Confirm Changes"
          message="Are you sure you want to update your account settings?"
          confirmText="Yes, Update"
          confirmColor="bg-purple-500 hover:bg-purple-700 text-white"
          onConfirm={() => {
            handleSaveChanges();
            setConfirmUpdate(false);
          }}
          onCancel={() => setConfirmUpdate(false)}
        />
      }
    </>
  );
}
