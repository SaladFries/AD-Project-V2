import React, { useState, useEffect } from 'react';
import './batch_inv.css';

//try adding first without going into database
//for putting products into options, for later
function addNewBatch(init){
  var select = document.getElementById("selectNumber");
  Object.keys(init).forEach(e => {
    var opt = e.Product_ID+", "+e.Product_Name+", "+e.Flavor+", "+e.Size;
    console.log(opt);
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = e.Product_ID;
    select.appendChild(el);
  });
}

function BatchInventory(){
  

/*const BatchInventory = () => {
  const [batches, setBatches] = useState([
    { batchNo: 7, product: 'Carabao Milk', size: 'Large', flavor: 'Plain', quantity: 3, manufacturingDate: '2024-04-30', expirationDate: '2024-05-27', expirationTime: '10:00PM', status: 'Pulled-out' },
    { batchNo: 10, product: 'Carabao Milk', size: 'Medium', flavor: 'Chocolate', quantity: 60, manufacturingDate: '2024-05-05', expirationDate: '2024-05-12', expirationTime: '5:00AM', status: 'Pulled-out' },
    { batchNo: 11, product: 'Carabao Milk', size: 'Large', flavor: 'Plain', quantity: 10, manufacturingDate: '2024-05-10', expirationDate: '2024-05-17', expirationTime: '5:00AM', status: 'In-stock' },
    { batchNo: 12, product: 'Carabao Milk', size: 'Medium', flavor: 'Strawberry', quantity: 20, manufacturingDate: '2024-05-12', expirationDate: '2024-05-19', expirationTime: '6:00PM', status: 'For stock' }
  ]);*/
  const [Initialproducts, setProduct] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/products')
    .then(res=>res.json())
    .then(InitialProducts=>setProduct(InitialProducts))
    .then(err=>console.log(err))
  }, [])

  const [InitialBatches, setInitBatches] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/batches')
    .then(res=>res.json())
    .then(InitialBatches=>setInitBatches(InitialBatches))
    .then(err=>console.log(err))
    //.then(console.log(InitialBatches));
  }, [])

  

  const mergedbatches = InitialBatches.map((e, i) =>{
    const temp = Initialproducts.find(element => element.Product_ID === e.Product_ID)
    if(temp.Product_Name){
      e.Product_Name = temp.Product_Name
      e.Flavor = temp.Flavor
      e.Size = temp.Size
    }
    return e;
  })

  const [batches, setBatches] = useState(mergedbatches);
  

  const [filter, setFilter] = useState({ size: '', flavor: '' });
  const [sortField, setSortField] = useState('expirationDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [newBatch, setNewBatch] = useState({ product: 'Carabao Milk', size: '', flavor: '', quantity: '', manufacturingDate: '', expirationDate: '', expirationTime: '', status: 'In-stock' });
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredBatches = batches.filter(batch => {
    const sizeMatch = filter.size ? batch.Size === filter.size : true;
    const flavorMatch = filter.flavor ? batch.Flavor === filter.flavor : true;
    const searchMatch = batch.Product_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        batch.Size.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        batch.Flavor.toLowerCase().includes(searchTerm.toLowerCase());
    return sizeMatch && flavorMatch && searchMatch;
  });

  const sortedBatches = filteredBatches.sort((a, b) => {
    if (sortField === 'batchNo' || sortField === 'quantity') {
      return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    } else {
      const dateA = new Date(a[sortField] + ' ' + a.expirationTime);
      const dateB = new Date(b[sortField] + ' ' + b.expirationTime);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

 
    
    /*for(var i = 0; i < Initialproducts.length; i++) {
      var opt = Initialproducts.Product_ID[i]+", "+Initialproducts.Product_Name[i]+", "+Initialproducts.Flavor[i]+", "+Initialproducts.Size[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = Initialproducts.Product_ID[i];
      select.appendChild(el);
      console.log("ara");
    }
    old thing*/  

  const addNewBatch = (e) => {
    e.preventDefault();
    setBatches([...batches, { ...newBatch, batchNo: batches.length + 1 }]);
    setIsAddingBatch(false);
    setNewBatch({ product: 'Carabao Milk', size: '', flavor: '', quantity: '', manufacturingDate: '', expirationDate: '', expirationTime: '', status: 'In-stock' });

    
  };

  const exportToCSV = () => {
    const csvData = [
      ["Batch No.", "Product", "Size", "Flavor", "Quantity", "Manufacturing Date", "Expiration Date", "Expiration Time", "Status"],
      ...mergedbatches.map(batch => [batch.batchNo, batch.product, batch.size, batch.flavor, batch.quantity, batch.manufacturingDate, batch.expirationDate, batch.expirationTime, batch.status])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'batch_inventory.csv';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  

  return (
    <div className="batch-inventory-container">
      <div className="batch-header">
        <h3>Batch Inventory</h3>
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label htmlFor="size-filter">Size: </label>
            <select id="size-filter" name="size" value={filter.size} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Large">Large</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
          <div>
            <label htmlFor="flavor-filter">Flavor: </label>
            <select id="flavor-filter" name="flavor" value={filter.flavor} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Plain">Plain</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Strawberry">Strawberry</option>
            </select>
          </div>
        </div>
      </div>
      <table className="batch-table">
        <thead>
          <tr>
            <th onClick={() => { setSortField('batchNo'); toggleSortOrder(); }}>Batch No.</th>
            <th>Product</th>
            <th>Size</th>
            <th>Flavor</th>
            <th onClick={() => { setSortField('quantity'); toggleSortOrder(); }}>Quantity</th>
            <th onClick={() => { setSortField('manufacturingDate'); toggleSortOrder(); }}>Manufacturing Date</th>
            <th onClick={() => { setSortField('expirationDate'); toggleSortOrder(); }}>Expiration Date</th>
            <th onClick={() => { setSortField('expirationTime'); toggleSortOrder(); }}>Expiration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedBatches.map(batch => (
            <tr key={batch.Batch_ID}>
              <td>{batch.Batch_ID}</td>
              <td>{batch.Product_ID}</td>
              <td>{batch.Size}</td>
              <td>{batch.Flavor}</td>
              <td>{batch.Quantity}</td>
              <td>{batch.Manufacturing_Date}</td>
              <td>{batch.Expiration_Date}</td>
              <td>{batch.Expiration_Time}</td>
              <td className={batch.Status.replace(' ', '-').toLowerCase()}>{batch.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="actions">
        <button onClick={() => setBatches(InitialBatches)}>Refresh</button>
        <button onClick={() => setIsAddingBatch(true)}>Add new batch &gt;&gt;&gt;</button>
        <button onClick={exportToCSV}>Export for Sale &gt;&gt;&gt;</button>
      </div>
      {isAddingBatch && (
  <div className="modal">
    <div className="modal-content">
      <h3>Add New Batch</h3>
      <form onSubmit={addNewBatch}>
        <div>
          <label htmlFor="size">Product:</label>
          <select
            id="size"
            value={newBatch.size}
            onChange={(e) => setNewBatch({ ...newBatch, size: e.target.value })}
            required
          >
            <option value="">Select Product</option>
            <option value="Large">1, Extra Large, Plain</option>
            <option value="Medium">2, Small, Plain</option>
          </select>
        </div>
        <input
          type="number"
          placeholder="Quantity"
          value={newBatch.quantity}
          onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Manufacturing Date"
          value={newBatch.manufacturingDate}
          onChange={(e) => setNewBatch({ ...newBatch, manufacturingDate: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Expiration Date"
          value={newBatch.expirationDate}
          onChange={(e) => setNewBatch({ ...newBatch, expirationDate: e.target.value })}
          required
        />
        <input
          type="time"
          placeholder="Expiration Time"
          value={newBatch.expirationTime}
          onChange={(e) => setNewBatch({ ...newBatch, expirationTime: e.target.value })}
          required
        />
        <select
          value={newBatch.status}
          onChange={(e) => setNewBatch({ ...newBatch, status: e.target.value })}
          required
        >
          <option value="In-stock">In-stock</option>
          <option value="Pulled-out">Pulled-out</option>
          <option value="For stock">For stock</option>
        </select>
        <div className="form-buttons">
          <button type="submit">Add Batch</button>
          <button type="button" onClick={() => setIsAddingBatch(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
</div>
);
};

export default BatchInventory;
