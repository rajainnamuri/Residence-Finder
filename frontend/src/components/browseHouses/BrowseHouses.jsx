import React, { useEffect, useState, useContext } from 'react';
import { IoCloseCircleSharp } from "react-icons/io5";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { loginContext } from '../../contexts/loginContext';
import { IoIosArrowDown } from "react-icons/io";
import { BsFilterSquareFill } from "react-icons/bs";
import './BrowseHouses.css';

function BrowseHouses() {
  const { currentTenant , tenantLoginStatus} = useContext(loginContext);
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlistModal, setWishlistModal] = useState(false);
  const [filters, setFilters] = useState({ rent: 'all', bedrooms: 'all', bathrooms: 'all', rooms: 'all' });

  async function fetchData() {
    try {      
      const housesRes = await fetch("http://localhost:4000/houses-api/");
      const housesData = await housesRes.json();
      let availableHouses = housesData.data.filter(house => !house.occupied);

      let tenantWishlistIds = [];
      if (tenantLoginStatus && currentTenant) {
        const wishlistRes = await fetch(`http://localhost:4000/wishlist-api/tenant/${currentTenant.username}`, {
          headers: { "Authorization": `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        const wishlistData = await wishlistRes.json();
        tenantWishlistIds = wishlistData.data.map(item => item._id);
      }

      availableHouses = availableHouses.filter(house => !tenantWishlistIds.includes(house._id));

      setHouses(availableHouses);
      setFilteredHouses(availableHouses);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentTenant,tenantLoginStatus]); 

  useEffect(() => {
    let filtered = houses.filter(house => house.address.toLowerCase().includes(search.toLowerCase()));

    if (filters.rent !== 'all') {
      if(filters.rent==='<3000') filtered = filtered.filter(house => (house.rent < 3000));
      else if(filters.rent==='>15000') filtered = filtered.filter(house => (house.rent > 15000));
      else{
        const [min, max] = filters.rent.split('-').map(Number);
        filtered = filtered.filter(house => (house.rent >= min && house.rent <= max));
      }
    }
    if (filters.bedrooms !== 'all') filtered = filtered.filter(house => filters.bedrooms === '>3' ? house.bedrooms > 3 : house.bedrooms == filters.bedrooms);
    if (filters.bathrooms !== 'all') filtered = filtered.filter(house => filters.bathrooms === '>3' ? house.bathrooms > 3 : house.bathrooms == filters.bathrooms);
    if (filters.rooms !== 'all') filtered = filtered.filter(house => filters.rooms === '>5' ? house.rooms > 5 :(filters.rooms === '<3' ? house.rooms <3 : house.rooms == filters.rooms));

    setFilteredHouses(filtered);
  }, [search, filters]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const toggleDetails = (house) => {
    setSelectedHouse(selectedHouse?._id === house._id ? null : house);
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  async function addToWishlist(house) {
    const houseData = { ...house, tenantUsername: currentTenant.username };

    await fetch("http://localhost:4000/wishlist-api/add", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem('authToken')}`
      },
      body: JSON.stringify(houseData)
    });

    setFilteredHouses(prevHouses => prevHouses.filter(h => h._id !== house._id));
    setWishlistModal(true);
  }

  const closeWishlistModal = () => {
    setWishlistModal(false);
  };

  return (
    <div className='browse-houses'>
      <div className='filters'>
        <h5><BsFilterSquareFill className='filter-icon' />     Filters</h5>
        <div className='filter-flex mb-3'>
        <div className='filter-group'>
          <p><strong>Rent:</strong></p>
          {['all', '<3000', '3000-5000', '5000-10000', '10000-15000', '>15000'].map(value => (
            <label key={value} className='d-block'>
              <input
                type="radio"
                name="rent"
                value={value}
                checked={filters.rent === value}
                onChange={() => handleFilterChange('rent', value)}
              />
              {value === 'all' ? 'All' : value}
            </label>
          ))}
        </div>
        <div className='filter-group'>
          <p><strong>Bedrooms:</strong></p>
          {['all', '1', '2', '3', '>3'].map(value => (
            <label key={value} className='d-block'>
              <input
                type="radio"
                name="bedrooms"
                value={value}
                checked={filters.bedrooms === value}
                onChange={() => handleFilterChange('bedrooms', value)}
              />
              {value === 'all' ? 'All' : value}
            </label>
          ))}
        </div>
        </div>
        <div className='filter-flex'>
        <div className='filter-group'>
          <p><strong>Bathrooms:</strong></p>
          {['all', '1', '2', '3', '>3'].map(value => (
            <label key={value} className='d-block'>
              <input
                type="radio"
                name="bathrooms"
                value={value}
                checked={filters.bathrooms === value}
                onChange={() => handleFilterChange('bathrooms', value)}
              />
              {value === 'all' ? 'All' : value}
            </label>
          ))}
        </div>
        <div className='filter-group'>
          <p><strong>Rooms:</strong></p>
          {['all', '<3', '3', '4', '5', '>5'].map(value => (
            <label key={value} className='d-block'>
              <input
                type="radio"
                name="rooms"
                value={value}
                checked={filters.rooms === value}
                onChange={() => handleFilterChange('rooms', value)}
              />
              {value === 'all' ? 'All' : value}
            </label>
          ))}
        </div>
        </div>
      </div>

      <div className='houses'>
        <input 
          type='text' 
          placeholder='Search by location...' 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className='search'
        />
        <div className='houses-list'>
        {filteredHouses.length === 0 ? (
      <p className='no-residences fs-1'>Oops! No residences found.</p>
    ) : (
          filteredHouses.map(house => (
            <div key={house.id} className='house-box'>
              <span className='fs-5'><strong>{house.address}</strong></span>
              <span className='fs-5'>₹{house.rent}</span>
              <button onClick={() => toggleDetails(house)} className='icon'><IoIosArrowDown /></button>
              {selectedHouse?._id === house._id && (
                <div className='house-details mt-3'>
                  <p className='fs-5'><strong>Bedrooms:</strong> {house.bedrooms}</p>
                  <p className='fs-5'><strong>Rooms:</strong> {house.rooms}</p>
                  <p className='fs-5'><strong>Bathrooms:</strong> {house.bathrooms}</p>
                  <p className='fs-5'><strong>Owner:</strong> {house.ownerUsername}</p>
                  <p className='fs-5'><strong>Owner Contact:</strong> {house.ownerPhone}</p>
                  {house.altPhone && <p className='fs-5'><strong>Alternate Contact:</strong> {house.altPhone}</p>}
                  <div className='buttons'>
                    <button onClick={() => openModal(0)}>View Images</button>
                    {tenantLoginStatus && <button onClick={() => addToWishlist(house)}>Add to Wishlist</button>}
                  </div>
                </div>
              )}
              
            </div>
          ))
        )}
        </div>
      </div>

      {showModal && selectedHouse && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='close-btn fs-1' onClick={closeModal}><IoCloseCircleSharp /></button>
            <img src={selectedHouse.images[currentImageIndex]} alt='House' />
            <div className='modal-controls'>
              {currentImageIndex > 0 && <button className='prev fs-1' onClick={() => setCurrentImageIndex(currentImageIndex - 1)}><GrFormPreviousLink /></button>}
              {currentImageIndex < selectedHouse.images.length - 1 && <button className='next fs-1' onClick={() => setCurrentImageIndex(currentImageIndex + 1)}><GrFormNextLink /></button>}
            </div>
          </div>
        </div>
      )}

{wishlistModal && (
        <div className='modal-overlay'>
          <div className='modal-content-1'>
            <h5>House successfully added to wishlist!</h5>
            <div className='button'><button className='btn btn-primary' onClick={closeWishlistModal}>OK</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseHouses;