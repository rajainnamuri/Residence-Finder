import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../../contexts/loginContext';
import './TenantDashboard.css';

function TenantDashboard() {
  const { currentTenant, tenantLoginStatus } = useContext(loginContext);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (tenantLoginStatus && currentTenant) {
      fetch(`http://localhost:4000/wishlist-api/tenant/${currentTenant.username}`, {
        headers: { "Authorization": `Bearer ${sessionStorage.getItem('authToken')}` }
      })
        .then(res => res.json())
        .then(data => setWishlist(data.data))
        .catch(error => console.log(error));
    }
  }, [tenantLoginStatus, currentTenant,wishlist]);

  return (
    <div className='tenant-dashboard'>
      <div className='hero'>
        <h1>Welcome, {currentTenant?.username}!</h1>
        <p className='fs-3'>Search and Add more Houses.. <span className='span fs-1' onClick={() => navigate('/browseHouses')}>Click Here</span></p>
      </div>
      {wishlist.length === 0 ? (
        <h3 className='head'>Your wishlist is empty.</h3>
      ) : (
        <>
          <h3 className='head'>Your Wishlist:</h3>
          <div className='houses-container'>
            {wishlist.map(house => (
              <div key={house.id} className='house-card' onClick={() => navigate('/viewHouse', { state: { houseId: house._id } })}>
                
                {house.occupied && <div className='ribbon'>Occupied</div>}

                <p className='fs-4'><strong className='color fs-3'>Address:</strong> {house.address}</p>
                <p className='fs-4'><strong className='color fs-3'>Rent:</strong> ₹{house.rent}</p>
                <p className='fs-4'><strong className='color fs-3'>Bedrooms:</strong> {house.bedrooms}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TenantDashboard;
