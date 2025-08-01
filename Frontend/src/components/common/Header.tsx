import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../slices/authSlice';
import ConfirmMenu from './ConfirmMenu';
import { useState } from 'react';
import { clearJobs } from '../../slices/jobSlice';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen }: Props) {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false)

  const handleLogout = () => {

    fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      credentials: 'include'
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Something went wrong");

        return data;
      })
      .then(() => {
        dispatch(logout());
        dispatch(clearJobs());
        navigate('/login');
      }).catch(err => console.error(err))

  }
  return (
    <>
      <header className="fixed top-0 left-0 z-50 bg-white shadow-sm h-16 w-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 hover:text-purple-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img onClick={() => navigate('/')} src="/logo.webp" alt="Cron Job Logo" className="h-8 w-8 cursor-pointer" />
            <span className="text-xl font-semibold text-gray-800">Cron Job</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span className="hidden sm:inline">Hello, {user?.name}</span>
          <button onClick={() => setConfirmLogout(true)} className="flex items-center gap-1 text-purple-600 hover:underline">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>
      {
        confirmLogout &&
        <ConfirmMenu
          title="Confirm Logout"
          message="Are you sure you want to logout from your account?"
          confirmText="Yes, Logout"
          confirmColor="bg-red-500 hover:bg-red-600 text-white"
          onConfirm={() => {
            handleLogout();
            setConfirmLogout(false);
          }}
          onCancel={() => setConfirmLogout(false)}
        />
      }
    </>
  );
}
