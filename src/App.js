import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import TopNavbar from './components/TopNavbar';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <TopNavbar />
      <div className="p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
