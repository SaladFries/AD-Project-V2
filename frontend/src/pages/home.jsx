import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Dashboard</h1>
      <p className="home-description">Overall System Report</p>
      <div className="home-section-container">
        <div className="home-section">
          <h2><Link to="/inventory" className="home-link">Inventory</Link></h2>
          <p>Total Items: 1000</p>
          <p>In Stock: 800</p>
          <p>Out of Stock: 200</p>
        </div>
        <div className="home-section">
          <h2><Link to="/supply" className="home-link">Supplies</Link></h2>
          <p>Total Suppliers: 50</p>
          <p>Active Suppliers: 40</p>
          <p>Inactive Suppliers: 10</p>
        </div>
        <div className="home-section">
          <h2><Link to="/track-order" className="home-link">Track Order</Link></h2>
          <p>Total Orders: 500</p>
          <p>Delivered Orders: 400</p>
          <p>Pending Orders: 100</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
