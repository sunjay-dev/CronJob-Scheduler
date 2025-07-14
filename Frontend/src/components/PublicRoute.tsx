import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { JSX } from 'react';

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const checked = useSelector((state: RootState) => state.auth.checked);
    
  if (!checked) {
    return <Navigate to="/" replace />;
  }

  return children;
}
