import React, { useContext, useState, useEffect } from 'react'
import './EditProfile.css'
import { useForm } from 'react-hook-form';
import { loginContext } from '../../contexts/loginContext';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const { currentOwner, currentTenant, setCurrentOwner, setCurrentTenant , setOwnerLoginStatus,setTenantLoginStatus } = useContext(loginContext);
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const password = watch("password");

  useEffect(() => {
    if (currentOwner) {
      setValue('username', currentOwner.username);
      setValue('email', currentOwner.email);
      setValue('mobile', currentOwner.mobile);
      setValue('role', currentOwner.role);
    } else if (currentTenant) {
      setValue('username', currentTenant.username);
      setValue('email', currentTenant.email);
      setValue('mobile', currentTenant.mobile);
      setValue('role', currentTenant.role);
    }
  }, [currentOwner, currentTenant, setValue]);

  useEffect(() => {
    
  }, [currentOwner, currentTenant]); 

  async function onSave(modifiedUser) {
    modifiedUser._id = currentOwner?._id || currentTenant?._id; 
    
    let userId = modifiedUser._id;  
    delete modifiedUser._id;  

    let res = await fetch(`http://localhost:4000/registrations-api/registrations/${userId}`, {
        method: 'PUT',
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(modifiedUser)
    });

    let result = await res.json();

    if (result.message === "Registration updated successfully") {
        if (modifiedUser.role === 'owner') {
            setCurrentOwner({ ...currentOwner, ...modifiedUser });
            setOwnerLoginStatus(true);
            setCurrentTenant(null);
            setTenantLoginStatus(false);
        } else if (modifiedUser.role === 'tenant') {
            setCurrentTenant({ ...currentTenant, ...modifiedUser });
            setTenantLoginStatus(true);
            setCurrentOwner(null);
            setOwnerLoginStatus(false);
        }
        setIsModalOpen(true);
    } 
}

  function closeModal() {
    setIsModalOpen(false);
    navigate('/viewProfile')
  }

  return (
    <div className='editProfile'>
      <div className='child2'><img src="https://futurestiles.com/wp-content/uploads/2024/08/20-Trending-Normal-House-Front-Elevation-Designs-in-2024.jpg" alt="" /></div>
      <div className='child1'>
        <div className='child'>
          <h1 className='pt-5 h'>Update Your Profile!</h1>
        </div>
        <div className='form'>
          {err.length !== 0 && <p className='text-danger'>{err}</p>}
          <form className='mt-3 p-4 mb-5' onSubmit={handleSubmit(onSave)}>
            <div className="form-row">
              <div className="mb-3">
                <label htmlFor="username" className='form-label'>Username</label>
                <input type="text" id='username' className='form-control' {...register("username", { required: true })} disabled />
                {errors.username?.type === 'required' && <p className="text-danger">*Username is required</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className='form-label'>Email</label>
                <input 
                  type="email" 
                  id='email' 
                  className='form-control' 
                  {...register("email", { 
                    required: true, 
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                      message: "Invalid email address"
                    }
                  })} 
                  placeholder='Email'
                />
                {errors.email?.type === 'required' && <p className='text-danger lead'>*Email is required</p>}
                {errors.email?.type === 'pattern' && <p className='text-danger lead'>{errors.email.message}</p>}
              </div>
            </div>
            <div className="form-row">
              <div className="mb-3">
                <label htmlFor="password" className='form-label'>Password</label>
                <input type="password" id='password' className='form-control' {...register("password", { required: true })} />
                {errors.password?.type === 'required' && <p className="text-danger">*Password is required</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className='form-label'>Confirm Password</label>
                <input 
                  type="password" 
                  id='confirmPassword' 
                  className='form-control' 
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) => value === password || 'Passwords do not match'
                  })} 
                />
                {errors.confirmPassword?.type === 'required' && <p className="text-danger">*Confirm Password is required</p>}
                {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <div className="form-row">
              <div className="mb-3">
                <label htmlFor="mobile" className='form-label'>Mobile Number</label>
                <input 
                  type="text" 
                  id='mobile' 
                  className='form-control' 
                  {...register("mobile", { 
                    required: true, 
                    minLength: 10, 
                    maxLength: 10, 
                    pattern: {
                      value: /^[1-9]{1}[0-9]{9}$/, 
                      message: "Invalid phone number"
                    },
                    validate: (value) => {
                      return !/^(\d)\1+$/.test(value) || "Phone number cannot be repetitive digits";
                    }
                  })} 
                  placeholder='Mobile number' 
                />
                {errors.mobile?.type === 'required' && <p className='text-danger lead'>*Mobile Number is required</p>}
                {errors.mobile?.type === 'minLength' && <p className='text-danger lead'>*Length should be 10</p>}
                {errors.mobile?.type === 'maxLength' && <p className='text-danger lead'>*Length should be 10</p>}
                {errors.mobile?.type === 'pattern' && <p className='text-danger lead'>{errors.mobile.message}</p>}
                {errors.mobile?.type === 'validate' && <p className='text-danger lead'>{errors.mobile.message}</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="role" className='form-label'>Role</label>
                <select 
                  id='role' 
                  className='form-control' 
                  {...register("role", { required: true })}>
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
                {errors.role?.type === 'required' && <p className="text-danger">*Role is required</p>}
              </div>
            </div>
            <div className='button mt-4'>
              <button className="fs-5 p-2">Save Details</button>
            </div>
          </form>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay edit-user-modal-overlay">
          <div className="modal-dialog edit-user-modal-dialog">
            <div className="modal-content edit-user-modal-content">
              <h5>Profile updated Successfully! Changes have been saved.</h5>
              <div className='button'>
                <button className="btn btn-primary mt-3" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditProfile;
