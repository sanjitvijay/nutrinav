import { Navbar3 } from "react-navbar-menu";
import { IoMdAddCircle } from "react-icons/io";
import { IoMdCheckmarkCircle } from "react-icons/io";
import 'boxicons/css/boxicons.min.css';
import { useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { GrCatalog } from "react-icons/gr";

function BottomNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (route)=> {
        if(route === location.pathname){
            return true
        }
        else return false
    }

    return (
        
        (isActive('/dashboard') || isActive('/add-food') || isActive('/log') 
        || isActive('/profile') || isActive('/user-info') || isActive('/manual-entry')) && (
        <div className="btm-nav border-t-2">
            <button
                onClick={()=>navigate('/log')}
            >
                <GrCatalog size={28} color={isActive('/log') ? 'oklch(var(--s))' : 'oklch(var(--p))'}/>
                <span className={`btm-nav-label ${isActive('/log') ? 'text-secondary' : 'text-primary'}`}>Log</span>
            </button>
            <button
                onClick={()=>navigate('/dashboard')}
            >
                <BiSolidDashboard size={30} color={isActive('/dashboard') ? 'oklch(var(--s))' : 'oklch(var(--p))'}/>
                <span className={`btm-nav-label ${isActive('/dashboard') ? 'text-secondary' : 'text-primary'}`}>Dashboard</span>
            </button>
            <button 
                onClick={()=>navigate('/add-food')}
            >
                <IoMdAddCircle size={30} color={isActive('/add-food') ? 'oklch(var(--s))' : 'oklch(var(--p))'}/>
                <span className={`btm-nav-label ${isActive('/add-food') ? 'text-secondary' : 'text-primary'}`}>Add Food</span>
            </button>
        </div>
        )
    );
}

export default BottomNavbar;