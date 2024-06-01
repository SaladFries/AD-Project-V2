import React from 'react';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>Supplies and Inventory Management</h1>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;