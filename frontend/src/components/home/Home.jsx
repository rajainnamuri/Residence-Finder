import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { TiTick } from "react-icons/ti";

const Home = () => {
  const navigate = useNavigate();

  function register(role) {
    navigate('/register',{ state: { role } });
  }
  function login(){
    navigate('/login');
  }
  function browse(){
    navigate('/browseHouses')
  }

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1 className="fs-1">Welcome to ResidenceFinder!</h1>
        <p className="fs-4">Find your next home or list your property for rent effortlessly.</p>
      </div>
      <div className="features">
      <div className="feature-card">
        <div className="image"><img src="https://static.vecteezy.com/system/resources/thumbnails/001/505/009/small_2x/search-icon-free-vector.jpg" alt="" />
        </div>
        <h3>Search</h3>
        <p>Search Prpoerties by Location.</p>
        <p>Connect with owners without signing up!</p>
          <button className="action-button mt-3 fs-5 mx-4 w-75" onClick={browse}>Search Properties</button>
        </div>
        <div className="feature-card">
          <div className="image"><img src="https://cdn-icons-png.flaticon.com/512/6200/6200105.png" alt="" />
          </div>
          <h3>For Tenants</h3>
          <p>Explore rental properties easily.</p>
          <p>Save properties to your wishlist.</p>
          <p>Connect with property owners.</p>
          <div>
            <button className="action-button mx-3 fs-5" onClick={login}>Sign In</button>
            <button className="action-button fs-5" onClick={() => register('tenant')}>Sign Up</button>
          </div>
        </div>
        <div className="feature-card">
          <div className="image"><img src="https://st2.depositphotos.com/41231304/43416/v/380/depositphotos_434167470-stock-illustration-landlord-icon-black-vector-sign.jpg" alt="" />
          </div>
          <h3>For Owners</h3>
          <p>List your properties for rent.</p>  
          <p>Manage your listings efficiently.</p>
          <p>Reach potential tenants easily.</p>
          <div>
            <button className="action-button mx-3 fs-5" onClick={login}>Sign In</button>
            <button className="action-button fs-5" onClick={() => register('owner')}>Sign Up</button>
          </div>
        </div>
      </div>
      <div className="about-section mt-5">
        <div className="child1">
        <h2>Why Choose Us?</h2>
        <p className="fs-5 mt-2">
          Our platform is designed to simplify the rental process for both
          tenants and property owners:
        </p>
        <ul>
          <li><p className="icon"><TiTick /></p> Search rental properties without signing up.</li>
          <li className="mt-2"><p className="icon"><TiTick /></p> Save your favorite listings to your wishlist.</li>
          <li className="mt-2"><p className="icon"><TiTick /></p> List and manage properties seamlessly.</li>
          <li className="mt-2"><p className="icon"><TiTick /></p> Secure communication between tenants and owners.</li>
        </ul>
        </div>
        <div className="child2">
          <img src="https://img.staticmb.com/mbcontent/images/crop/uploads/2022/12/tips-to-find-house-for-rent_0_1200.jpg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
