import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import TopNavbar from './components/TopNavbar';
import SignUp from './pages/SignUp';
import AddFood from './pages/AddFood';
import Dashboard from './pages/Dashboard';
import BottomNavbar from './components/BottomNavbar';
import Log from './pages/Log';
import ForgotPassword from './pages/ForgotPassword';
import {Toaster} from 'react-hot-toast';
import AuthRoute from './components/AuthRoute';

function App() {
  return (
    <>
      <TopNavbar />
      <div className="p-5 pt-20 pb-16">
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path="/add-food" element={<AuthRoute />}>
            <Route path="/add-food" element={<AddFood />} />
          </Route>
          <Route path="/dashboard" element ={<AuthRoute/>}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/log" element={<AuthRoute />}>
            <Route path="/log" element={<Log />} />
          </Route>
          
        </Routes>
      </div>
      <BottomNavbar/>
    </>
  )
}

export default App;
