import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, Signup, Dashboard, CreateJob, Jobs, EditJob,Logs, JobLogs,Settings } from './pages';
import { Layout } from './components';


export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateJob />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:jobId/logs" element={<JobLogs />} />
          <Route path="/job/:jobId/edit" element={<EditJob />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}