import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login, Signup, Dashboard, CreateJob, Jobs, Logs } from './pages';

export default function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/login' element={<Login/>} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/create' element={<CreateJob />} />
    <Route path='/jobs' element={<Jobs />} />
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/' element={<Logs />} />
   </Routes>
   </BrowserRouter>
  )
}