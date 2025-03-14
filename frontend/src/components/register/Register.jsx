import React from 'react';
import './Register.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Register() {
  const { register, handleSubmit,setValue, formState: { errors }, watch } = useForm();
  const password = watch("password");
  let navigate = useNavigate();
  let [err, setErr] = useState("");
  const location = useLocation();
  const [defaultRole, setDefaultRole] = useState('');

  useEffect(() => {
    if (location.state?.role) {
      setDefaultRole(location.state.role);
      setValue("role", location.state.role); 
    }
  }, [location.state, setValue]);
  

  async function onUserRegister(newUser) {
    try {
      let res = await fetch('http://localhost:4000/registrations-api/registrations', {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newUser)
      });

      let result = await res.json();

      if (result.message === "Username already exists") {
        setErr("Username already exists. Please choose a different username.");
      } else if (result.message === "User registered successfully") {
        navigate('/login');
      } else {
        setErr("Failed to create user. Please try again.");
      }
    } catch (err) {
      setErr(err.message);
    }
  }

  return (
    <div className='register'>
      <div className='child1'>
      <div className='child'>
        <h1 className='pt-5 h'>Create Account</h1>
        <p className='mt-3 p fs-5 pb-2'>Already Have an Account? <Link to='/login'>Sign In</Link> and continue your journey.</p>
        </div>
      <div className='form'>
        {err.length !== 0 && <p className='text-danger'>{err}</p>}
        <form className='mt-3 p-4 mb-5' onSubmit={handleSubmit(onUserRegister)}>
  <div className="form-row">
    <div className="mb-3">
      <label htmlFor="username" className='form-label fs-5'>Username</label>
      <input type="text" id='username' className='form-control' {...register("username", { required: true })} />
      {errors.username?.type === 'required' && <p className="text-danger">*Username is required</p>}
    </div>
    <div className="mb-3">
      <label htmlFor="email" className='form-label fs-5'>Email</label>
      <input type="email" id='email' className='form-control' {...register("email", {
        required: true,
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Invalid email address"
        }
      })} />
      {errors.email?.type === 'required' && <p className='text-danger'>*Email is required</p>}
      {errors.email?.type === 'pattern' && <p className='text-danger'>{errors.email.message}</p>}
    </div>
  </div>
  <div className="form-row">
    <div className="mb-3">
      <label htmlFor="password" className='form-label fs-5'>Password</label>
      <input type="password" id='password' className='form-control' {...register("password", { required: true })} />
      {errors.password?.type === 'required' && <p className="text-danger">*Password is required</p>}
    </div>
    <div className="mb-3">
      <label htmlFor="confirmPassword" className='form-label fs-5'>Confirm Password</label>
      <input type="password" id='confirmPassword' className='form-control' {...register("confirmPassword", {
        required: true,
        validate: (value) => value === password || 'Passwords do not match'
      })} />
      {errors.confirmPassword?.type === 'required' && <p className="text-danger">*Password is required</p>}
      {errors.confirmPassword && <p className="text-danger">*{errors.confirmPassword.message}</p>}
    </div>
  </div>
  <div className="form-row">
    <div className="mb-3">
      <label htmlFor="mobile" className='form-label fs-5'>Mobile Number</label>
      <input type="text" id='mobile' className='form-control' {...register("mobile", {
        required: true,
        minLength: 10,
        maxLength: 10,
        pattern: {
          value: /^[1-9]{1}[0-9]{9}$/,
          message: "Invalid phone number"
        },
        validate: (value) => !/^(\d)\1+$/.test(value) || "Phone number cannot be repetitive digits"
      })} />
      {errors.mobile?.type === 'required' && <p className='text-danger'>*Mobile Number is required</p>}
      {errors.mobile?.type === 'minLength' && <p className='text-danger'>*Length should be 10</p>}
      {errors.mobile?.type === 'maxLength' && <p className='text-danger'>*Length should be 10</p>}
      {errors.mobile?.type === 'pattern' && <p className='text-danger'>{errors.mobile.message}</p>}
      {errors.mobile?.type === 'validate' && <p className='text-danger'>{errors.mobile.message}</p>}
    </div>
    <div className="mb-3">
              <label htmlFor="role" className='form-label fs-5'>Register as</label>
              <div>
                <input
                  type="radio"
                  id="tenant"
                  value="tenant"
                  {...register("role", { required: true })}
                  checked={watch("role") === 'tenant'} 
                  onChange={() => setValue("role", "tenant")} 
                />
                <label htmlFor="tenant" className='form-label'>Tenant</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="owner"
                  value="owner"
                  {...register("role", { required: true })}
                  checked={watch("role") === 'owner'}
                  onChange={() => setValue("role", "owner")}
                />
                <label htmlFor="owner" className='form-label'>Owner</label>
              </div>
              {errors.role?.type === 'required' && <p className="text-danger">*Please select a role</p>}
            </div>
  </div>
  <div className='button mt-4'>
    <button className="fs-5 p-2">Sign Up</button>
  </div>
</form>
      </div>
      </div>
      <div className='child2'><img src="https://www.houseplansdaily.com/uploads/images/202308/image_750x_64ccdea7bb0b8.jpg" alt="" /></div>
      </div>
  );
}

export default Register;
