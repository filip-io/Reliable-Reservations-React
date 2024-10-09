import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/images/logo.png'
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page text-center">
      <h2>
        <span className="lead welcome-intro">Welcome to</span>
      </h2>
      <h1 className="welcome-text">
        <span className="display-4 restaurant-name">Magnificent Restaurant</span>
      </h1>
      <p className="culinary-experience">
        A culinary experience beyond anything you've ever experienced.
      </p>
      <img className="logo-image"
        src={logo}
        alt="Logo"
        style={{ width: '350px', height: 'auto', margin: '15px 10px', marginBottom: '5px' }}
      />
      <Link to="/reserve" className="reserve-button" role="button">
        Reserve a Table
      </Link>
    </div>
  );
}

export default HomePage;