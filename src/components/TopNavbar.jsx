import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { useAuth } from '../context/AuthProvider';

function TopNavbar() {
  const navigate = useNavigate()
  const {user, logout} = useAuth()  

  return (
    <div className="navbar bg-base-100 border-b-2 fixed z-10">   
      <div className="navbar-start">
        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Homepage</a></li>
            <li><a>Portfolio</a></li>
            <li><a>About</a></li>
          </ul>
        </div> */}
      </div>
      <div className="navbar-center">
        <button className="btn btn-ghost">
          <img src={Logo} alt="Logo" onClick={()=>navigate('/dashboard')}/>
        </button>
      </div>
      <div className="navbar-end">
        {user &&
          <button 
            className='btn btn-sm btn-primary text-white'
            onClick={logout}
          >
            Sign Out
          </button> 
        }
      </div>
    </div>

  );
}

export default TopNavbar;
