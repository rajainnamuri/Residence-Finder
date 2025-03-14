import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../../contexts/loginContext';
import './AddHouse.css';

function AddHouse() {
  const { currentOwner, ownerLoginStatus } = useContext(loginContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [roomPhotos, setRoomPhotos] = useState([]);

  function modalDisplay() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    navigate('/ownerDashboard');
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setRoomPhotos((prevPhotos) => [...prevPhotos, reader.result]);
      };
    });
  };

  async function onHouseAdd(house) {
    if (!ownerLoginStatus) {
      alert("Only logged-in owners can add houses.");
      return;
    }

  if (roomPhotos.length === 0) {
    alert("Please upload at least one photo.");
    return;
  }
    
  const houseData = { ...house, ownerUsername: currentOwner.username, images: roomPhotos, occupied: false };
  try {
    let res = await fetch('http://localhost:4000/houses-api/add', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem('authToken')}`
      },
      body: JSON.stringify(houseData)
    });
    let data = await res.json();
    if (data.message=="House added successfully") {
      setShowModal(true);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
  }

  return (
    <div className='addHouse'>
      <div className='hero'>
      <h2>List Your House for Rent</h2>
      </div>
      <form onSubmit={handleSubmit(onHouseAdd)}>
        <div className="form-row">
          <div className="form-group">
            <label>Owner Name</label>
            <input type='text' value={currentOwner?.username || ''} readOnly className='form-control' />
          </div>
          <div className="form-group">
            <label>Owner Phone Number</label>
            <input type='text' {...register("ownerPhone", { required: true, pattern: /^[1-9][0-9]{9}$/ })} className='form-control' />
            {errors.ownerPhone && <p className='error'>*Valid phone number required</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Alternate Number</label>
            <input type='text' {...register("altPhone", { pattern: /^[1-9][0-9]{9}$/ })} className='form-control' />
            {errors.altPhone && <p className='error'>*Valid phone number required</p>}
          </div>
          <div className="form-group">
            <label>Rent Price</label>
            <input type='number' {...register("rent", { required: true, min: 1 })} className='form-control' />
            {errors.rent && <p className='error'>*Valid rent price required</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Number of Bedrooms</label>
            <input type='number' {...register("bedrooms", { required: true, min: 1 })} className='form-control' />
            {errors.bedrooms && <p className='error'>*Required</p>}
          </div>
          <div className="form-group">
            <label>Number of Rooms</label>
            <input type='number' {...register("rooms", { required: true, min: 1 })} className='form-control' />
            {errors.rooms && <p className='error'>*Required</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Number of Bathrooms</label>
            <input type='number' {...register("bathrooms", { required: true, min: 1 })} className='form-control' />
            {errors.bathrooms && <p className='error'>*Required</p>}
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea {...register("address", { required: true })} className='form-control'></textarea>
            {errors.address && <p className='error'>*Address is required</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="roomPhotos" className='form-label'>Upload Photos</label>
            <input type="file" id='roomPhotos' className='form-control' multiple onChange={handlePhotoChange} />
          </div>
        </div>
        {roomPhotos.length > 0 && (
          <div className="mt-3">
            <h5>Uploaded Photos:</h5>
            <div className="d-flex flex-wrap">
              {roomPhotos.map((photo, index) => (
                <div key={index} className="me-3">
                  <img src={photo} alt={`Uploaded preview ${index}`} width="100" height="100" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='button'>
        <button type='submit' className='btn fs-5'>Add House</button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Your house has been successfully listed for rent.</h5>
            <div className='button'>
                <button className='btn btn-primary fs-5' onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddHouse;
