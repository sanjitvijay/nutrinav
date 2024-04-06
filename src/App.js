import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import TopNavbar from './components/TopNavbar';
import SignUp from './pages/SignUp';
import AddFood from './pages/AddFood';
import Dashboard from './pages/Dashboard';
import BottomNavbar from './components/BottomNavbar';
import Log from './pages/Log';

function App() {
  return (
    <Router>
      <TopNavbar />
      <div className="p-5 pt-20 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/add-food" element={<AddFood />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/log" element={<Log />} />
        </Routes>
      </div>
      <BottomNavbar/>
    </Router>
  )
}

export default App;
