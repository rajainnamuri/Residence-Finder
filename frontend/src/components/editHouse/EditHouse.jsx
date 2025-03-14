import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginContext } from '../../contexts/loginContext';
import './EditHouse.css';

function EditHouse() {
  const location = useLocation();
  const { currentOwner, ownerLoginStatus } = useContext(loginContext);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { houseId } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [roomPhotos, setRoomPhotos] = useState([]);

  useEffect(() => {
    async function fetchHouseDetails() {
      try {
        let res = await fetch(`http://localhost:4000/houses-api/${houseId}`, {
          headers: { "Authorization": `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        let data = await res.json();
        if (data.message=="House fetched successfully") {
          setValue("ownerPhone", data.data.ownerPhone);
          setValue("altPhone", data.data.altPhone);
          setValue("rent", data.data.rent);
          setValue("bedrooms", data.data.bedrooms);
          setValue("rooms", data.data.rooms);
          setValue("bathrooms", data.data.bathrooms);
          setValue("address", data.data.address);
          setRoomPhotos(data.data.images || []);
        } else {
          alert("Failed to fetch house details.");
          navigate('/ownerDashboard');
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchHouseDetails();
  }, [houseId, setValue, navigate]);

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

  const removePhoto = (index) => {
    setRoomPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  async function onHouseEdit(house) {
    if (!ownerLoginStatus) {
      alert("Only logged-in owners can edit houses.");
      return;
    }
    if (roomPhotos.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }
    
    const updatedHouse = { ...house, ownerUsername: currentOwner.username, images: roomPhotos };
    try {
      let res = await fetch(`http://localhost:4000/houses-api/${houseId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updatedHouse)
      });
      let response=await res.json()
      if (response.message=="House updated successfully") {
        modalDisplay();
      } else {
        alert("Error updating house details.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='editHouse'>
      <div className='hero'>
        <h2>Edit Your House Details</h2>
      </div>
      <form onSubmit={handleSubmit(onHouseEdit)}>
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
            <div className="d-flex flex-wrap justify-content-center">
              {roomPhotos.map((photo, index) => (
                <div key={index} className="mt-3">
                  <img src={photo} alt={`Uploaded preview ${index}`} width="100" height="100" style={{ objectFit: 'cover' }} />
                  <button className="btn btn-danger w-50 mt-2" onClick={() => removePhoto(index)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='button'>
          <button type='submit' className='btn fs-5'>Save Changes</button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Your house details have been successfully updated.</h5>
            <div className='button'>
              <button className='btn btn-primary fs-5' onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditHouse;
