import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

import { useEffect } from 'react';
import { setAuth } from '../slices/authSlice';
import { useAppDispatch } from '../hooks';

export default function Layout() {
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/details`, {
          credentials: 'include',
        })
          .then(async (res) => {
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Something went wrong");
          return data
        }).then(data => {
  
            dispatch(setAuth({ user: { name: data.name, email: data.email, timezone: data.timezone } }));
          })
          .catch(err => {
            console.error('User not logged in', err);
          });
    }, [ dispatch]);

  return (
    <div className="bg-gray-50 h-dvh overflow-x-hidden font-[Inter]">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar collapsed={sidebarOpen} />

      <div className={`mt-16 p-12 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'}`}>
        <Outlet /> 
        <Footer />
      </div>
    </div>
  );
}
