import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Nutrinavfull from '../assets/Nutrinavfull.svg'
import { useAuth } from '../context/AuthProvider';
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";
import toast from 'react-hot-toast';

function TopNavbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.hostname)
    .then(() => {
      toast.success("Link copied to clipboard");
    })
    .catch((error) => {
      toast.error("Failed to copy link: " + error);
    });
  }
  return (
    <div className="navbar bg-base-100 border-b-2 fixed z-10">
      <div className="navbar-start">
        {/* {user &&
          <button className="btn btn-ghost btn-circle"
            onClick={() => navigate('/profile')}
          >
            <FaRegCircleUser size={30} color='oklch(var(--s))' />
          </button>
        } */}
        {user && 
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <FaRegCircleUser size={30} color='oklch(var(--s))' />
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li onClick={()=>navigate('/profile')}><a>Profile</a></li>
              <li onClick={logout}><a>Sign Out</a></li>
              <li onClick={()=>navigate('/report-bug')}><a>Report Bug</a></li>
            </ul>
          </div>
      }
      </div>
      <div className="navbar-center">
        {/* <button className="btn btn-ghost ">
          <img src={Logo} alt="Logo" onClick={()=>navigate('/dashboard')}/>
        </button> */}
        <button
          className='btn btn-ghost w-48'
          onClick={() => navigate('/dashboard')}
        >
          <img src={Nutrinavfull} />
        </button>
      </div>
      <div className="navbar-end">
        <button
          className='btn btn-ghost btn-circle'
          onClick={copyLink}
        >
          <FaShareAlt size={25} color='oklch(var(--s))'/>
        </button>
      </div>
    </div>

  );
}

export default TopNavbar;
