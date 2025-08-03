import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, Signup, Dashboard, CreateJob, Jobs, EditJob, Logs, JobLogs, Settings, NotFoundPage } from './pages';
import { Layout, ProtectedRoute, PublicRoute } from './components';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
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

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
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