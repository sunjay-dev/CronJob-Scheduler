import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Login, Signup, Dashboard, CreateJob, Jobs, ResetPassword, EditJob, Logs, JobLogs, Settings, NotFoundPage, ForgotPassword, VerifyEmail } from './pages';
import { Layout, ProtectedRoute, PublicRoute } from './components';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />

        <Route path="/verify-email/:userId" element={
          <VerifyEmail />
        } />

        <Route path="/reset-password/:token" element={
          <ResetPassword />
        } />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateJob />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:jobId/logs" element={<JobLogs />} />
            <Route path="/job/:jobId/edit" element={<EditJob />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}