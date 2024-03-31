import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import TopNavbar from './components/TopNavbar';
import SignUp from './pages/SignUp';
import AddFood from './pages/AddFood';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';

function App() {
  return (
    <Router>
      <TopNavbar />
      <div className="p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/add-food" element={<AddFood />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
