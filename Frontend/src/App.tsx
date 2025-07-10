import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login, Signup, CreateJob,Jobs } from './pages';

export default function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/login' element={<Login/>} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/' element={<CreateJob />} />
    <Route path='/jobs' element={<Jobs />} />
   </Routes>
   </BrowserRouter>
  )
}