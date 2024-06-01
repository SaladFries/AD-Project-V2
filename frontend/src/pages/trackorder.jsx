import React, { useState } from 'react';
import './trackorder.css'; // Ensure you have a CSS file named trackorder.css for styling

const TrackOrder = () => {
  const [orders, setOrders] = useState([
    { orderNo: 123, item: 'Carabao Milk', quantity: 4, orderDate: '4/15/2024', status: 'In-transit' },
    { orderNo: 224, item: 'Carabao Milk', quantity: 2, orderDate: '4/12/2024', status: 'In-transit' },
    { orderNo: 260, item: 'Carabao Milk', quantity: 1, orderDate: '4/20/2024', status: 'In-transit' },
    { orderNo: 623, item: 'Carabao Milk', quantity: 1, orderDate: '4/21/2024', status: 'In-transit' },
    { orderNo: 655, item: 'Carabao Milk', quantity: 1, orderDate: '5/12/2024', status: 'For refund' },
  ]);
  const [filter, setFilter] = useState('All');
  const [showFulfilled, setShowFulfilled] = useState(false);

  const filteredOrders = filter === 'All'
    ? orders
    : orders.filter(order => order.status === filter);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleStatusChange = (orderNo, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderNo === orderNo ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleShowFulfilled = () => {
    setShowFulfilled(true);
  };

  const handleExportForSale = () => {
    const csvData = orders.map(order => ({
      OrderNo: order.orderNo,
      Item: order.item,
      Quantity: order.quantity,
      OrderDate: order.orderDate,
      RefundRequestDate: order.status === 'For refund' ? order.orderDate : '--',
      OrderStatus: order.status,
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent =
      headers.join(',') +
      '\n' +
      csvData.map(row => headers.map(header => row[header]).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'orders_for_sale.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportForFinance = () => {
    const filteredOrdersForFinance = orders.filter(
      order => order.status === 'Fulfilled' || order.status === 'For refund'
    );

    const csvData = filteredOrdersForFinance.map(order => ({
      OrderNo: order.orderNo,
      Item: order.item,
      Quantity: order.quantity,
      OrderDate: order.orderDate,
      RefundRequestDate: order.status === 'For refund' ? order.orderDate : '--',
      OrderStatus: order.status,
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent =
      headers.join(',') +
      '\n' +
      csvData.map(row => headers.map(header => row[header]).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'orders_for_finance.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target.result;
      // Process the CSV data, e.g., parse it and update state or perform other operations
      console.log(csvData);
    };
    reader.readAsText(file);
  };

  return (
    <div className="order-management-container">
      <div className="sidebar">
        <h3>Order Filters</h3>
        <button className={filter === 'All' ? 'active' : ''} onClick={() => handleFilterChange('All')}>All Orders</button>
        <button className={filter === 'In-transit' ? 'active' : ''} onClick={() => handleFilterChange('In-transit')}>In-transit & For Refund</button>
        <button className={filter === 'Fulfilled' ? 'active' : ''} onClick={() => handleFilterChange('Fulfilled')}>Fulfilled</button>
      </div>

      <div className="orders-table">
        <input type="file" className="add-csv-button" onChange={handleFileUpload} />
        <h2>Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Ordered Item</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>Refund Request Date</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.orderNo}>
                <td>{order.orderNo}</td>
                <td>{order.item}</td>
                <td>{order.quantity}</td>
                <td>{order.orderDate}</td>
                <td>{order.status === 'For refund' ? order.orderDate : '--'}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderNo, e.target.value)}
                  >
                    <option value="In-transit">In-transit</option>
                    <option value="For refund">For refund</option>
                    <option value="Fulfilled">Fulfilled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="export-buttons">
          <button onClick={handleExportForSale}>Export for Sale</button>
          <button onClick={handleExportForFinance}>Export for Finance</button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
