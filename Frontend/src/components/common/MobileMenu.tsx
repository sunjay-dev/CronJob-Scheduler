import { X, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { logout } from "../../slices/authSlice";
import { clearJobs } from "../../slices/jobSlice";
import ConfirmMenu from "./ConfirmMenu";
import { useState } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearJobs());
    setIsOpen(false);
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center text-lg font-medium">

        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-purple-600"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="flex flex-col items-center gap-6">
          <NavLink
            className="font-semibold hover:underline hover:scale-105 transition"
            to="/dashboard"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            className="font-semibold hover:underline hover:scale-105 transition"
            to="/jobs"
            onClick={() => setIsOpen(false)}
          >
            Jobs
          </NavLink>
          <NavLink
            className="font-semibold hover:underline hover:scale-105 transition"
            to="/logs"
            onClick={() => setIsOpen(false)}
          >
            Logs
          </NavLink>
          <NavLink
            className="font-semibold hover:underline hover:scale-105 transition"
            to="/settings"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </NavLink>
        </nav>

        <button
          onClick={() => setConfirmLogout(true)}
          className="mt-8 flex items-center gap-2 text-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg transition duration-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {confirmLogout && (
        <ConfirmMenu
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          confirmText="Yes, Logout"
          confirmColor="bg-red-500 hover:bg-red-600 text-white"
          onConfirm={() => {
            handleLogout();
            setConfirmLogout(false);
          }}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
    </>
  );
}
