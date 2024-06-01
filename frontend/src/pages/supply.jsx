import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './supply.css';


function SupplyInventory(){

  const [initialSuppliers, setSuppliers] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/suppliers')
    .then(res=>{return res.json()})
    .then(InitialSuppliers=>setSuppliers(InitialSuppliers))
    .then(err=>console.log(err))
  }, [])

  const [initialSupplies, setSupply] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/supplies')
    .then(res=>{return res.json()})
    .then(InitialSupplies=>setSupply(InitialSupplies))
    .then(err=>console.log(err))
  }, [])
  

  /*const initialSupplies = [
    { id: 1, name: 'Large Bottle', SupplyPrice: 10.00, quantity: 21, supplier: 'A&A Bottlers, Co.' },
    { id: 2, name: 'Medium Bottle', SupplyPrice: 7.00, quantity: 4, supplier: 'A&A Bottlers, Co.' },
  ];*/

  const mergedsupply = initialSupplies.map((e, i) =>{
    const tempo = initialSuppliers.find(element => element.Supplier_ID === e.Supplier_ID)
    if(tempo.SupplierName){
      e.SupplierName = tempo.SupplierName
    }
    return e;
  })

  const [supplies, setSupplies] = useState(initialSupplies);
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [resupplyCount, setResupplyCount] = useState(0);
  const [purchaseList, setPurchaseList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editSupply, setEditSupply] = useState({ Supply_ID: null, name: '', SupplyPrice: 0, SupplyQty: 0, SupplierName: '' });
  const [newSupply, setNewSupply] = useState({ name: '', SupplyPrice: 0, SupplyQty: 0, SupplierName: '' });
  const [searchQuery, setSearchQuery] = useState('');


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedSupply(null);
  };

  const handleSupplySelect = (supply) => {
    setSelectedSupply(supply);
    setResupplyCount(0);
  };

  const handleResupplyCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setResupplyCount(count >= 0 ? count : 0);
  };

  const handleAddToPurchase = () => {
    if (selectedSupply && resupplyCount > 0) {
      const newPurchaseItem = {
        ...selectedSupply,
        resupplyCount,
        amountPurchase: selectedSupply.SupplyPrice * resupplyCount,
      };
      setPurchaseList([...purchaseList, newPurchaseItem]);
      setSelectedSupply(null);
      setResupplyCount(0);
    }
  };

  const handleImportClick = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data.map((row, index) => ({
            Supply_ID: supplies.length + index + 1,
            SupplyName: row['Supply Name'],
            SupplyPrice: parseFloat(row['Price per Unit (Php)']),
            SupplyQty: parseInt(row['Quantity'], 10),
            SupplierName: row['Supplier'],
          }));
  
          const updatedSupplies = [...supplies];
  
          parsedData.forEach((newSupply) => {
            const existingSupply = updatedSupplies.find((supply) => supply.SupplyName === newSupply.SupplyName);
  
            if (existingSupply) {
              existingSupply.SupplyQty += newSupply.SupplyQty;
            } else {
              updatedSupplies.push(newSupply);
            }
          });
  
          setSupplies(updatedSupplies);
        },
      });
    }
  };

  const handleExportClick = () => {
    const csvData = purchaseList.map(item => ({
      'Supply Name': item.SupplyName,
      'Price per Unit (Php)': item.SupplyPrice.toFixed(2),
      'Quantity': item.resupplyCount,
      'Amount Purchase (Php)': item.amountPurchase.toFixed(2),
      'Supplier': item.SupplierName,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'purchase_list.csv';
    link.click();
  };

  const handleEditSupply = (supply) => {
    setEditSupply(supply);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (editSupply.Supply_ID) {
      setSupplies(supplies.map(supply => (supply.Supply_ID === editSupply.Supply_ID ? editSupply : supply)));
    }
    setEditSupply({ Supply_ID: null, SupplyName: '', SupplyPrice: 0, SupplyQty: 0, SupplierName: '' });
    setIsEditing(false);
  };

  const handleAddNewSupply = () => {
    setNewSupply({ SupplyName: '', SupplyPrice: 0, SupplyQty: 0, SupplierName: '' });
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleSaveNew = () => {
    setSupplies([...supplies, { ...newSupply, id: supplies.length + 1 }]);
    setNewSupply({ SupplyName: '', SupplyPrice: 0, SupplyQty: 0, SupplierName: '' });
    setIsAdding(false);
  };

  const filteredSupplies = supplies.filter(supply =>
    supply.SupplyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="supply-inventory-container">
      <div className="sidebar">
        <h3>Stocks Inventory</h3>
        <ul>
          <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => handleTabClick('inventory')}>Inventory</li>
          <li className={activeTab === 'request' ? 'active' : ''} onClick={() => handleTabClick('request')}>Request for Resupply</li>
          <li className={activeTab === 'purchase' ? 'active' : ''} onClick={() => handleTabClick('purchase')}>Purchase</li>
        </ul>
      </div>

      <div className="inventory-content">
        {activeTab === 'inventory' && (
          <>
            <h2>Supply Inventory</h2>
            <div className="table-actions">
              <input
                type="text"
                className="search-bar"
                placeholder="Search supplies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="button-group">
                <button className="add-supply-button" onClick={() => setSupplies(initialSupplies)}>Refresh</button>
                <button className="add-supply-button" onClick={handleAddNewSupply}>Add Supply</button>
                <input type="file" accept=".csv" onChange={handleImportClick} className="import-button" />
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Supply Name</th>
                  <th>Price per Unit (Php)</th>
                  <th>Quantity</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupplies.map((supply) => (
                  <tr
                    key={supply.Supply_ID}
                    onClick={() => handleSupplySelect(supply)}
                    className={selectedSupply?.Supply_ID === supply.Supply_ID ? 'selected-row' : ''}
                  >
                    <td>{supply.SupplyName}</td>
                    <td>{supply.SupplyPrice.toFixed(2)}</td>
                    <td>
                      {supply.SupplyQty < 20 ? (
                        <div className="alert">
                          <span className="alert-text">Low Stock!</span> {supply.SupplyQty}
                        </div>
                      ) : (
                        supply.SupplyQty
                      )}
                    </td>
                    <td>{supply.SupplierName}</td>
                    <td>
                      <button onClick={() => handleEditSupply(supply)}>Edit</button>
                      <button onClick={() => setSupplies(supplies.filter(s => s.Supply_ID !== supply.Supply_ID))}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

{activeTab === 'request' && (
  <>
    <h2>Request for Resupply</h2>
    <div className="form-container">
      <table className="request-table">
        <thead>
          <tr>
            <th>Supply Name</th>
            <th>Price per Unit (Php)</th>
            <th>Quantity</th>
            <th>Supplier</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {supplies.filter(supply => supply.SupplyQty < 20).map((supply) => (
            <tr
              key={supply.Supply_ID}
              onClick={() => handleSupplySelect(supply)}
              className={selectedSupply?.Supply_ID === supply.Supply_ID ? 'selected-row' : ''}
            >
              <td>{supply.SupplyName}</td>
              <td>{supply.SupplyPrice.toFixed(2)}</td>
              <td>
                <div className="alert">
                  <span className="alert-text">Low Stock!</span> {supply.SupplyQty}
                </div>
              </td>
              <td>{supply.SupplierName}</td>
              <td>
                <input
                  type="radio"
                  name="selectedSupply"
                  checked={selectedSupply?.Supply_ID === supply.Supply_ID}
                  onChange={() => handleSupplySelect(supply)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

              {selectedSupply && (
                <div className="resupply-form">
                  <h3>Resupply for: {selectedSupply.SupplyName}</h3>
                  <div>
                    <label>Price per Unit:</label>
                    <span>{selectedSupply.SupplyPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <label>Supplier:</label>
                    <span>{selectedSupply.SupplierName}</span>
                  </div>
                  <div>
                    <label>Resupply Quantity:</label>
                    <input type="number" value={resupplyCount} onChange={handleResupplyCountChange} />
                  </div>
                  <button onClick={handleAddToPurchase}>Add to Purchase</button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'purchase' && (
          <>
            <h2>Purchase List</h2>
            <div className="table-actions">
              <button className="export-button" onClick={handleExportClick}>Export to CSV</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Supply Name</th>
                  <th>Price per Unit (Php)</th>
                  <th>Quantity</th>
                  <th>Amount Purchase (Php)</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {purchaseList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.SupplyName}</td>
                    <td>{item.SupplyPrice.toFixed(2)}</td>
                    <td>{item.resupplyCount}</td>
                    <td>{item.amountPurchase.toFixed(2)}</td>
                    <td>{item.SupplierName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {isEditing && (
          <div className="edit-modal">
          <div className="edit-modal-content"> 
            <h2>Edit Supply</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div>
                <label>Supply Name:</label>
                <input type="text" value={editSupply.SupplyName} onChange={(e) => setEditSupply({ ...editSupply, name: e.target.value })} required />
              </div>
              <div>
                <label>Price per Unit (Php):</label>
                <input type="number" step="0.01" value={editSupply.SupplyPrice} onChange={(e) => setEditSupply({ ...editSupply, SupplyPrice: parseFloat(e.target.value) })} required />
              </div>
              <div>
                <label>Quantity:</label>
                <input type="number" value={editSupply.SupplyQty} onChange={(e) => setEditSupply({ ...editSupply, quantity: parseInt(e.target.value, 10) })} required />
              </div>
              <div>
                <label>Supplier:</label>
                <input type="text" value={editSupply.SupplierName} onChange={(e) => setEditSupply({ ...editSupply, supplier: e.target.value })} required />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          </div>
          </div>
        )}

        {isAdding && (
          <div className="edit-modal"> {/* Reusing the same modal class for consistency */}
          <div className="edit-modal-content">
            <h2>Add New Supply</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveNew(); }}>
              <div>
                <label>Supply Name:</label>
                <input type="text" value={newSupply.SupplyName} onChange={(e) => setNewSupply({ ...newSupply, name: e.target.value })} required />
              </div>
              <div>
                <label>Price per Unit (Php):</label>
                <input type="number" step="0.01" value={newSupply.SupplyPrice} onChange={(e) => setNewSupply({ ...newSupply, SupplyPrice: parseFloat(e.target.value) })} required />
              </div>
              <div>
                <label>Quantity:</label>
                <input type="number" value={newSupply.SupplyQty} onChange={(e) => setNewSupply({ ...newSupply, quantity: parseInt(e.target.value, 10) })} required />
              </div>
              <div>
                <label>Supplier:</label>
                <input type="text" value={newSupply.SupplierName} onChange={(e) => setNewSupply({ ...newSupply, supplier: e.target.value })} required />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
            </form>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyInventory;