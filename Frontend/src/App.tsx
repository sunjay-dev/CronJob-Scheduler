import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login, Signup, Jobs } from './pages';

export default function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/login' element={<Login/>} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/' element={<Jobs />} />
   </Routes>
   </BrowserRouter>
  )
}