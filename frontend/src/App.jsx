import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import NavigationBar from './components/navbar';
import Home from './pages/home';
import Inventory from './pages/inventory';
import BatchInventory from './pages/batch_inv';
import Supply from './pages/supply';
import Supplier from './pages/supplier';
import TrackOrder from './pages/trackorder';
import TrackOrder2 from './pages/trackorder2';





const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/product-list" element={<Inventory />} />
          <Route path="/inventory/batch-inventory" element={<BatchInventory />} />
          <Route path="/supply" element={<Supply />} />
          <Route path="/supply/supply" element={<Supply />} />
          <Route path="/supply/supplier" element={<Supplier />} />
          <Route path="/track-order/OrderIn-Transit&ForRefund" element={<TrackOrder />} />
          <Route path="trackorder/order&refundfullfilled" element={<TrackOrder2 />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;