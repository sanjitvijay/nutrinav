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
import UserInfo from './pages/UserInfo';
import ManualEntryForm from './pages/ManualEntryForm';
import Profile from './pages/Profile';
import AuthRoute from './components/AuthRoute';
import ReportBug from './pages/ReportBug';
import CalorieCalc from './pages/CalorieCalc';
import MoreFoodInfo from './pages/MoreFoodInfo';
import ScannerPage from './pages/ScannerPage';
import Choose from './pages/Choose';
import {Toaster} from 'react-hot-toast';
import Edit from './pages/Edit';



function App() {
  return (
    <>
      <TopNavbar />
      <div className="p-5 pt-20 pb-20">
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
          <Route path="/user-info" element={<AuthRoute />}>
            <Route path="/user-info" element={<UserInfo />} />
          </Route>
          <Route path="/manual-entry" element={<AuthRoute />}>
            <Route path="/manual-entry" element={<ManualEntryForm />} />
          </Route>
          <Route path="/profile" element={<AuthRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/report-bug" element={<AuthRoute />}>
            <Route path="/report-bug" element={<ReportBug />} />
          </Route>
          <Route path="/calorie-calc" element={<AuthRoute />}>
            <Route path="/calorie-calc" element={<CalorieCalc />} />
          </Route>
          <Route path="/more-info" element={<AuthRoute />}>
            <Route path="/more-info" element={<MoreFoodInfo />} />
          </Route>
          <Route path="/scanner" element={<AuthRoute />}>
            <Route path="/scanner" element={<ScannerPage />} />
          </Route>
          <Route path="/choose" element={<AuthRoute />}>
            <Route path="/choose" element={<Choose />} />
          </Route>
          <Route path="/edit" element={<AuthRoute />}>
            <Route path="/edit" element={<Edit />} />
          </Route>
        </Routes>
      </div>
      <BottomNavbar/>
    </>
  )
}

export default App;

