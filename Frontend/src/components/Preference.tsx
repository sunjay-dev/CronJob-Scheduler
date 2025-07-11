import { useState } from "react";
export default function Preference() {
   const [darkMode, setDarkMode] = useState(false);
    const [hourFormat24, setHourFormat24] = useState(true);
  return (
    <div className='border border-gray-200 rounded-lg px-4 py-6 space-y-6'>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className=" text-gray-700">Dark Mode</span>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${darkMode ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className=" text-gray-700">24-Hour Time Format</span>
                <button
                  type="button"
                  onClick={() => setHourFormat24(!hourFormat24)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${hourFormat24 ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${hourFormat24 ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
  )
}
