import React, { useContext } from 'react';
import { loginContext } from '../../contexts/loginContext';
import './ViewProfile.css';
import { ImProfile } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { IoArrowBackCircleSharp } from "react-icons/io5";

function ViewProfile() {
    const { currentOwner, currentTenant, ownerLoginStatus, tenantLoginStatus } = useContext(loginContext);
    let navigate=useNavigate()
    function edit(){
      navigate('/editProfile')
    }
    const [user, setUser] = useState(null);

    function dashboard(){
      if (ownerLoginStatus) {
        navigate('/ownerDashboard')
    } else if (tenantLoginStatus) {
        navigate('/tenantDashboard')
    }
    }

    useEffect(() => {
      if (ownerLoginStatus) {
          setUser(currentOwner);
      } else if (tenantLoginStatus) {
          setUser(currentTenant);
      } else {
          setUser(null);
      }
  }, [currentOwner, currentTenant, ownerLoginStatus, tenantLoginStatus]);
    return (
        <div className="viewProfile">
            <div className='back' onClick={dashboard}>
                <IoArrowBackCircleSharp />
            </div>
            <div className='hero'>
              <h1>Profile Details</h1>
            </div>
            <div className='profile'>
              <h1 className='icon'><ImProfile /></h1>
            {user ? (
                <div className="profile-card fs-4 mt-4">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Mobile:</strong> {user.mobile}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <div className='button'>
                      <button onClick={edit}>Edit Profile</button>
                    </div>
                </div>
            ) : (
                <p className="error-message fs-3">No user is logged in.</p>
            )}
            </div>
        </div>
    );
}

export default ViewProfile;
