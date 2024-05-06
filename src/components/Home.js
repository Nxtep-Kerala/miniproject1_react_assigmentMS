import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Assignment App!</h1> 
      <div className="button-container">
        <Link to="/login" className="button">Login</Link>
        <Link to="/register" className="button">Register</Link>
        <Link to="/create-assignment" className="button">Teacher Login</Link>
      </div>
    </div>
  );
};

export default Home;
