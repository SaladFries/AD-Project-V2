import React, { useState, useEffect } from 'react';
import {setTimeout} from 'timers';
import './inventory.css';

function Inventory(){
  const [Initialprods, setProduct] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/products')
    .then(res=>{return res.json()})
    .then(InitialProducts=>setProduct(InitialProducts))
    .then(err=>console.log(err))
  }, [])
  
  
  const [products, setProducts] = useState(Initialprods);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', size: '', flavor: '' });
  const [sortFlavor, setSortFlavor] = useState('');
  const [sortSize, setSortSize] = useState('');

  //for looping for options
  /*var selectSize = document.getElementById("selectSize");

  for(var i = 0; i < Initialprods.length; i++) {
      var opt = Initialprods.Size[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
  }*/
  
  useEffect(() => {
    let filteredProducts = Initialprods.filter(product =>
      product.Product_Name.toLowerCase().includes(searchTerm.toLowerCase() || '') ||
      product.Flavor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortFlavor) {
      filteredProducts = filteredProducts.filter(product => product.Flavor === sortFlavor);
    }

    if (sortSize) {
      filteredProducts = filteredProducts.filter(product => product.Size === sortSize);
    }

    setProducts(filteredProducts);
    console.log(filteredProducts);
  }, [searchTerm, sortFlavor, sortSize]);

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const addProduct = (prod) => {
    prod.Product_ID = products.length + 1;
    setProducts([...products, prod]);
    setAdding(false);
  };

  const editProduct = (product) => {
    setEditing(true);
    setCurrentProduct({ ...product });
  };

  const updateProduct = (id, updatedProduct) => {
    setEditing(false);
    setProducts(products.map(product => (product.Product_ID === id ? updatedProduct : product)));
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Product List</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or Flavor..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-bar">
        <select onChange={(e) => setSortFlavor(e.target.value)} value={sortFlavor}>
          <option value="">All (Flavor)</option>
          <option value="Plain">Plain</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Strawberry">Strawberry</option>
        </select>
        <select onChange={(e) => setSortSize(e.target.value)} value={sortSize}>
          <option value="">All (Size)</option>
          <option value="Large">Large</option>
          <option value="Medium">Medium</option>
          <option value="Small">Small</option>
        </select>
      </div>

      <div className="button-container">
        {!editing && !adding && (
          <button className="add-button" onClick={() => setAdding(true)}>
            Add New Product
          </button>
        )}
        <button className="add-button" onClick={() => setProducts(Initialprods)}>
            Refresh
          </button>
      </div>


      {editing && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const data = {
                Product_Name: currentProduct.Product_Name,
                Flavor: currentProduct.Flavor,
                Size: currentProduct.Size
              }
              const requestOptions = {
                method: "PUT",
                headers: { 'Content-type': 'application/json'},  
                body: JSON.stringify(data
                )
            };
            fetch('http://localhost:8081/products/'+currentProduct.Product_ID, requestOptions)
                .then(response => console.log(response.status))
                //.then(data => console.log(data))
                //.catch(error => console.error(error));
              updateProduct(currentProduct.Product_ID, currentProduct);
            }}>
              <label>
                Name:
                <input 
                  type="text" 
                  value={currentProduct.Product_Name} 
                  onChange={(e) => setCurrentProduct({ ...currentProduct, Product_Name: e.target.value })} 
                />
              </label>
              <label>
                Size:
                <input 
                  type="text" 
                  value={currentProduct.Size} 
                  onChange={(e) => setCurrentProduct({ ...currentProduct, Size: e.target.value })} 
                />
              </label>
              <label>
                Flavor:
                <input 
                  type="text" 
                  value={currentProduct.Flavor} 
                  onChange={(e) => setCurrentProduct({ ...currentProduct, Flavor: e.target.value })} 
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Update</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {adding && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Add New Product</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const data = {
                Product_ID: products.length + 1,
                Product_Name: newProduct.Product_Name,
                Flavor: newProduct.Flavor,
                Size: newProduct.Size
              }
              const requestOptions = {
                method: "POST",
                headers: { 'Content-type': 'application/json'},  
                body: JSON.stringify(data)
              };
              fetch('http://localhost:8081/products/add', requestOptions)
                .then(response => console.log(response.status))
                .catch((err)=>console.log(err));
              addProduct(newProduct);
            }}>
              <label>
                Name:
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={newProduct.Product_Name} 
                  onChange={(e) => setNewProduct({ ...newProduct, Product_Name: e.target.value })} 
                />
              </label>
              <label>
                Size:
                <input 
                  type="text" 
                  placeholder="Size" 
                  value={newProduct.Size} 
                  onChange={(e) => setNewProduct({ ...newProduct, Size: e.target.value })} 
                />
              </label>
              <label>
                Flavor:
                <input 
                  type="text" 
                  placeholder="Flavor" 
                  value={newProduct.Flavor} 
                  onChange={(e) => setNewProduct({ ...newProduct, Flavor: e.target.value })} 
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Add</button>
                <button onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Flavor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.Product_ID}>
              <td>{product.Product_ID}</td>
              <td>{product.Product_Name}</td>
              <td>{product.Size}</td>
              <td>{product.Flavor}</td>
              <td>
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={(e) => {
                  fetch('http://localhost:8081/products/'+product.Product_ID, {method: 'DELETE'})
                  .then(result =>{
                  if(!result.ok){
                    console.log("ew");
                    return;
                  }
                  return result.json();
                  })
                  .then(data=>{
                    console.log('Success');
                  })
                  .catch(error=>{
                    console.log(error);
                  })
                  deleteProduct(product.id)}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;

//old axios
    /*e.preventDefault();
    axios.put('http://localhost:8081/products/'+currentProduct.Product_ID, currentProduct)
    .then(res =>res.json
    )
    .catch(err =>console.log(err))
    updateProduct(currentProduct.Product_ID, currentProduct);*/
