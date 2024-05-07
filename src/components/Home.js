import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="left-panel">
        <h1 className="Header1">
          <span>WORK</span> <span>TRACKING</span> <span>MADE</span> <span>EASY</span><span className="light">No more dues</span>
        </h1>
        
      </div>
      <div className="right-panel">
        <div className="button-container">
          <Link to="/login" className="button">Login</Link>
          <Link to="/register" className="button">Register</Link>
          <Link to="/create-assignment" className="button">Teacher Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
