import React from 'react'
import './Login.css'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { loginContext } from '../../contexts/loginContext'
import { useEffect } from 'react'

function Login() {
  let {loginUser,tenantLoginStatus,ownerLoginStatus,err}=useContext(loginContext)
  const { register, handleSubmit, formState: { errors }} = useForm()
  let navigate=useNavigate()

  async function onUserLogin(userCred) {
    loginUser(userCred)
  }

  useEffect(()=>{
    if(tenantLoginStatus===true){
      navigate('/tenantDashboard')
    }
    if(ownerLoginStatus===true){
      navigate('/ownerDashboard')
    }
  },[tenantLoginStatus, ownerLoginStatus, navigate])
  return (
    <div className='login'>
      <div className='hero'>
        <h1>One Platform, Two Roles – Access Your Account</h1>
      </div>
      <div className='child'>
          <div className='child1'>
            <img src="https://media.istockphoto.com/id/504481783/photo/giving-house-keys.jpg?s=612x612&w=0&k=20&c=tUdPUBEWlVY3D9B0h0AYQ9jB1SFNEsr-VXBkUcpy1XY=" alt="" />
          </div>
          <div className='child2'>
            <h3 className='mt-4'>Sign In now</h3>
            <p className='fs-5 mt-4'>New here? <Link to='/register'>Sign Up</Link> as Tenant or Owner.</p>
            {err.length!=0&&<p className='text-danger fs-3'>{err}</p>}
            <form className='mx-auto mt-1 p-4 mb-5' onSubmit={handleSubmit(onUserLogin)}>
          <div className="mb-3">
              <label htmlFor="username" className='form-label'>Username</label>
              <input type="text" id='username' className='form-control' {...register("username", { required: true })} />
              {errors.username?.type === 'required' && <p className="text-danger fs-5">*Username is required</p>}
          </div>
          <div className="mb-3">
              <label htmlFor="password" className='form-label'>Password</label>
              <input type="password" id='password' className='form-control' {...register("password", { required: true })} />
              {errors.password?.type === 'required' && <p className="text-danger fs-5">*Password is required</p>}
          </div>
          <div className='button mt-4'>
            <button className='fs-4'>Sign In</button>
          </div>
      </form>
          </div>
      </div>
    </div>
  )
}

export default Login