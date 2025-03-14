import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import { SiGnuprivacyguard } from "react-icons/si";
import { FaSignInAlt } from "react-icons/fa";
import { GiHouse } from "react-icons/gi";
import { useContext } from 'react';
import { loginContext } from '../../contexts/loginContext';
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Header() {
  let {logoutUser,ownerLoginStatus,tenantLoginStatus,currentOwner,currentTenant}=useContext(loginContext)
  let navigate=useNavigate()
  function logout(){
    logoutUser()
  }
  return (
    <div className='header'>
      <Link to='' className='nav-link'><h1 className='p-2'>ResidenceFinder</h1></Link>
    {tenantLoginStatus===false && ownerLoginStatus===false?(
        <ul className='nav p-2'>
            <li className='nav-item nav-i'>
                <Link to='register' className='nav-link text-dark a'>
                Sign Up</Link>
            </li>
            <li className='nav-item nav-i'>
                <Link to='login' className='nav-link text-dark a'>
                Sign In</Link>
             </li>
        </ul>
    ):(
      <ul className='nav p-2'>
            <li className='nav-item nav-i'>
                <Link to='register' className='nav-link text-dark a' onClick={logout}>
                Sign Out</Link>
            </li>
            <li className='nav-item'>
                <Link to='viewProfile' className='nav-link text-dark a'>
                <CgProfile className='profile fs-1'/></Link>
             </li>
        </ul>
    )
    }
  </div>
  )
}

export default Header