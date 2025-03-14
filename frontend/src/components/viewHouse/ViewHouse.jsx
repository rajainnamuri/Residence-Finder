import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ViewHouse.css';
import { IoCloseCircleSharp } from "react-icons/io5";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { loginContext } from '../../contexts/loginContext';

function ViewHouse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { houseId } = location.state || {};
  const { tenantLoginStatus, ownerLoginStatus } = useContext(loginContext);
  const [house, setHouse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:4000/houses-api/${houseId}`, {
      headers: { "Authorization": `Bearer ${sessionStorage.getItem('authToken')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "House fetched successfully") {
          setHouse(data.data);
        } else {
          alert("Error fetching house details.");
        }
      })
      .catch(error => console.log(error));
  }, [houseId]);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextImage = () => {
    if (currentImageIndex < house.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const deleteHouse = async () => {
    if (window.confirm("Are you sure you want to delete this house?")) {
      try {
        let res = await fetch(`http://localhost:4000/houses-api/${houseId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        let response=await res.json();
        if (response.message=="House deleted successfully") {
          alert("House deleted successfully.");
          navigate('/ownerDashboard');
        } else {
          alert("Error deleting house.");
        }
      } catch (error) {
        console.log(error);
      }
      try {
        await fetch(`http://localhost:4000/wishlist-api/${houseId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${sessionStorage.getItem('authToken')}` }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeFromWishlist = async () => {
    if (window.confirm("Are you sure you want to remove this house from your wishlist?")) {
      try {
        let res = await fetch(`http://localhost:4000/wishlist-api/${houseId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        let response=await res.json()
        if (response.message=="Wishlist item removed successfully") {
          alert("House removed from wishlist.");
          navigate('/tenantDashboard');
        } else {
          alert("Error removing house from wishlist.");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className='view-house'>
      {house ? (
        <>
          <div className='view'>
            <h1 className='mb-4'>House Details</h1>
            <p className='fs-3'><strong>Address:</strong> {house.address}</p>
            <p className='fs-3'><strong>Rent:</strong> ₹{house.rent}</p>
            <p className='fs-3'><strong>Bedrooms:</strong> {house.bedrooms}</p>
            <p className='fs-3'><strong>Rooms:</strong> {house.rooms}</p>
            <p className='fs-3'><strong>Bathrooms:</strong> {house.bathrooms}</p>
            <p className='fs-3'><strong>Owner Contact:</strong> {house.ownerPhone}</p>
            {house.altPhone && <p className='fs-3 mb-4'><strong>Alternate Contact:</strong> {house.altPhone}</p>}

            <div className='button'>
              {tenantLoginStatus ? (
                <>
                  <button className='btn fs-5' onClick={() => openModal(0)}>View Images</button>
                  <button className='btn delete fs-5' onClick={removeFromWishlist}>Remove from Wishlist</button>
                </>
              ) : ownerLoginStatus ? (
                <>
                  <button className='btn fs-5' onClick={() => navigate('/editHouse', { state: { houseId } })}>Edit House</button>
                  <button className='btn delete fs-5' onClick={deleteHouse}>Delete House</button>
                  <button className='btn fs-5' onClick={() => openModal(0)}>View Images</button>
                </>
              ) : null}
            </div>
          </div>

          {showModal && (
            <div className='modal-overlay'>
              <div className='modal-content'>
                <button className='close-btn fs-1' onClick={closeModal}><IoCloseCircleSharp /></button>
                <img src={house.images[currentImageIndex]} alt='House' />
                <div className='modal-controls'>
                  {currentImageIndex > 0 && <button className='prev fs-1' onClick={prevImage}><GrFormPreviousLink /></button>}
                  {currentImageIndex < house.images.length - 1 && <button className='next fs-1' onClick={nextImage}><GrFormNextLink /></button>}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading house details...</p>
      )}
    </div>
  );
}

export default ViewHouse;