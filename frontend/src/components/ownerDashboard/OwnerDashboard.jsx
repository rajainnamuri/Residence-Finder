import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../../contexts/loginContext';
import './OwnerDashboard.css';

function OwnerDashboard() {
  const { currentOwner, ownerLoginStatus } = useContext(loginContext);
  const [houses, setHouses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (ownerLoginStatus && currentOwner) {
      fetch(`http://localhost:4000/houses-api/owner/${currentOwner.username}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            setHouses(data.data);
          } else {
            console.error("Unexpected API response:", data);
          }
        })
        .catch(error => console.log(error));
    }
  }, [ownerLoginStatus, currentOwner]);

  const toggleOccupiedStatus = async (houseId, occupied) => {
    try {
      let res = await fetch(`http://localhost:4000/houses-api/${houseId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ occupied: !occupied })
      });

      const response = await res.json();
      if (response && response.message) {
        setHouses(prevHouses => prevHouses.map(house => 
          house._id === houseId ? { ...house, occupied: !occupied } : house
        ));
      } else {
        console.error("Unexpected API response:", response);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      await fetch(`http://localhost:4000/wishlist-api/${houseId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ occupied: !occupied })
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='owner-dashboard'>
      <div className='hero'>
      <h1>Welcome, {currentOwner?.username}!</h1>
      <p className='fs-3'>Add more houses to your listing and manage them easily. <span className='span fs-1' onClick={() => navigate('/addHouse')}>Click Here</span></p>
      </div>
      {houses.length === 0 ? (
        <h3 className='head'>You have not added any house yet.</h3>
      ) : (
        <>
          <h3 className='head'>Your Listed Houses:</h3>
          <div className='houses-container'>
            {houses.map(house => (
              <div key={house._id} className='house-card' onClick={() => navigate('/viewHouse', { state: { houseId: house._id } })}>
                <p className='fs-4'><strong className='color fs-3'>Address:</strong> {house.address}</p>
                <p className='fs-4'><strong className='color fs-3'>Rent:</strong> ₹{house.rent}</p>
                <p className='fs-4'><strong className='color fs-3'>Bedrooms:</strong> {house.bedrooms}</p>
                <div className='button'>
                <button 
                  className={`btn fs-5 ${house.occupied ? 'occupied' : 'unoccupied'}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOccupiedStatus(house._id, house.occupied);
                  }}>
                  {house.occupied ? 'Mark as Unoccupied' : 'Mark as Occupied'}
                </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default OwnerDashboard;
