import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Nutrinavfull from '../assets/Nutrinavfull.svg'
import { useAuth } from '../context/AuthProvider';
import { FaRegCircleUser } from "react-icons/fa6";

function TopNavbar() {
  const navigate = useNavigate()
  const {user, logout} = useAuth()  

  return (
    <div className="navbar bg-base-100 border-b-2 fixed z-10">   
      <div className="navbar-start">
        {user && 
          <button className="btn btn-ghost btn-circle"
            onClick={()=>navigate('/profile')} 
          > 
            <FaRegCircleUser size={30} color= 'oklch(var(--s))' />
          </button> 
        }
      </div>
      <div className="navbar-center">
        {/* <button className="btn btn-ghost ">
          <img src={Logo} alt="Logo" onClick={()=>navigate('/dashboard')}/>
        </button> */}
        <button
          className='btn btn-ghost w-48'
        >
          <img src={Nutrinavfull}/>
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
