import { Controller, type Control } from "react-hook-form";
import type { UserWithoutEmail } from "../../types";
import { ToggleSwitch } from "../common";

interface Props {
  control: Control<UserWithoutEmail>;
}
export default function Preference({ control }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg px-4 py-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className=" text-gray-700">Dark Mode</span>

          <Controller
            name="mode"
            control={control}
            render={({ field }) => (
              <div className="relative inline-flex items-center">
                <input
                  id={`switch-theme-mode`}
                  type="checkbox"
                  checked={field.value === "dark"}
                  onChange={() => field.onChange(field.value === "dark" ? "day" : "dark")}
                  className="peer appearance-none w-11 h-4.5 rounded-full bg-gray-200 border border-gray-300 
                           checked:bg-gradient-to-r checked:from-purple-600 checked:to-purple-800 
                           transition-all duration-300 cursor-pointer"
                />
                <label
                  htmlFor={`switch-theme-mode`}
                  className="absolute -top-[0.1rem] left-0 h-5.5 w-5.5 bg-white rounded-full shadow-md border border-gray-300 
                           transform transition-all duration-300 peer-checked:translate-x-5.5 
                           peer-active:scale-90 cursor-pointer"
                ></label>
              </div>
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className=" text-gray-700">24-Hour Time Format</span>
          <ToggleSwitch control={control} name="timeFormat24" />
        </div>
      </div>
    </div>
  );
}
