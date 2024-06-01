import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const DropdownMenu = ({ items, isOpen, handleMouseEnter, handleMouseLeave }) => (
  <ul 
    className={`dropdown-menu ${isOpen ? 'show' : ''}`}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    {items.map((item, index) => (
      <li key={index} className="dropdown-item">
        <Link to={item.link} className="dropdown-link">
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

const NavItem = ({ label, link, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timer = useRef(null);

  const handleMouseEnter = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timer.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <li 
      className="nav-item" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <Link to={link || '#'} className="nav-link">
        {label}
      </Link>
      {items && (
        <DropdownMenu 
          items={items} 
          isOpen={isOpen} 
          handleMouseEnter={handleMouseEnter} 
          handleMouseLeave={handleMouseLeave} 
        />
      )}
    </li>
  );
};

const NavigationBar = () => {
  const navItems = [
    {
      label: 'Home',
      link: '/',
    },
    {
      label: 'Inventory',
      items: [
        {
          label: 'Product List',
          link: '/inventory/product-list',
        },
        {
          label: 'Batch Inventory',
          link: '/inventory/batch-inventory',
        },
      ],
    },
    {
      label: 'Supply',
      items: [
        {
          label: 'Supply Stocks',
          link: '/supply/supply',
        },
        {
          label: 'Supplier',
          link: '/supply/supplier',
        },
      ],
    },
    {
      label: 'Track Order',
      items: [
        {
          label: 'Order In-Transit & For Refund',
          link: '/track-order/OrderIn-Transit&ForRefund',
        },
        {
          label: 'Order & Refund Fullfilled',
          link: 'trackorder/order&refundfullfilled',
        },
      ],
    },
  ];

  return (
    <nav className="nav-container">
      <ul className="nav-items">
        {navItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
