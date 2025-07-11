import { useState } from 'react';
import { Preference } from '../components';
import { Pencil, Save } from "lucide-react";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [email] = useState('john@example.com');
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("Sunjay Kumar");

  return (
    <>
       <h1 className="text-3xl text-purple-600 mb-6">Settings</h1>

        <form className="space-y-10 bg-white p-6 rounded-xl shadow">

          <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6'>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    readOnly
                    className="w-full mt-1 bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <Preference />

          <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6'>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className=" text-gray-700">Email Notifications</span>
                <button
                  type="button"
                  onClick={() => setEmailNotifs(!emailNotifs)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${emailNotifs ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${emailNotifs ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className=" text-gray-700">Push Alerts</span>
                <button
                  type="button"
                  onClick={() => setPushAlerts(!pushAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${pushAlerts ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${pushAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

             <div className="text-right">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </>
  );
}
