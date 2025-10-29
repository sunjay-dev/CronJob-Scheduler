import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

interface Props<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    disabled?: boolean;
}

export default function ToggleSwitch<T extends FieldValues>({ control, name, disabled = false }: Props<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="relative inline-flex items-center">
                    <input
                        id={`switch-${name}`}
                        type="checkbox"
                        disabled={disabled}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="peer appearance-none w-11 h-4.5 rounded-full bg-gray-200 border border-gray-300 
                           checked:bg-gradient-to-r checked:from-purple-600 checked:to-purple-800 
                           transition-all duration-300 cursor-pointer"
                    />
                    <label
                        htmlFor={`switch-${name}`}
                        className="absolute -top-[0.1rem] left-0 h-5.5 w-5.5 bg-white rounded-full shadow-md border border-gray-300 
                           transform transition-all duration-300 peer-checked:translate-x-5.5 
                           peer-active:scale-90 cursor-pointer"
                    ></label>
                </div>
            )}
        />
    )
}
