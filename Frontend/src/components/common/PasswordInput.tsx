import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface PasswordInputProps<T extends { password: string }> {
  details: T;
  setDetails: React.Dispatch<React.SetStateAction<T>>;
}

export default function PasswordInput<T extends { password: string }>({details,setDetails}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col space-y-1 relative">
      <label htmlFor="password" className="text-sm font-medium">Password</label>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          required
          onChange={e => setDetails(prev => ({ ...prev, password: e.target.value }))}
          value={details.password}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />

        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
