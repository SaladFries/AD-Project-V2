import React, { useState, useEffect } from 'react';
import './supplier.css';



function SupplierDetails() {

    
    const [initialSupplierNames, setSupplierNames] = useState([])
    useEffect(()=>{
      fetch('http://localhost:8081/suppliers/suppliernames')
      .then(res=>{return res.json()})
      .then(InitialSupplierNames=>setSupplierNames(InitialSupplierNames))
      .then(err=>console.log(err))
    }, [])

    const [initialSuppliers, setSupplier] = useState([])
    useEffect(()=>{
      fetch('http://localhost:8081/suppliers')
      .then(res=>{return res.json()})
      .then(InitialSuppliers=>setSupplier(InitialSuppliers))
      .then(err=>console.log(err))
    }, [])

    const [selectedSupplier, setSelectedSupplier] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        SupplierName: '',
        SupplierAddress: '',
        SupplierNo: '',
        SupplierEmail: '',
        Remarks: ''
    });


    const initialDetails = {
        '1': {
            SupplierName: 'Albert & Andeng Bottlers, Corporation',
            SupplierAddress: '009 IT Street, Barangay Dos, Gasan, Marinduque',
            SupplierNo: '(042) 890 9989',
            SupplierEmail: 'aa@gmail.com',
            Remarks: 'Good supplier'
        },
        '2': {
            SupplierName: 'Hitachi, Inc.',
            SupplierAddress: '1234 Tech Road, Tokyo, Japan',
            SupplierNo: '(081) 123 4567',
            SupplierEmail: 'contact@hitachi.com',
            Remarks: 'Reliable supplier'
        },
        '3': {
            SupplierName: 'Critical Point, Inc.',
            SupplierAddress: '5678 Industry Lane, Silicon Valley, CA',
            SupplierNo: '(408) 789 0123',
            SupplierEmail: 'info@criticalpoint.com',
            Remarks: 'Great for tech products'
        }
    };

    const [details, setDetails] = useState(initialSuppliers);


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setIsAdding(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isAdding) {
            setNewSupplier(prevDetails => ({
                ...prevDetails,
                [name]: value
            }));
        } else {
            setDetails(prevDetails => ({
                ...prevDetails,
                [selectedSupplier]: {
                    ...prevDetails[selectedSupplier],
                    [name]: value
                }
            }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isAdding) {
            setDetails(prevDetails => ({
                ...prevDetails,
                [newSupplier.name]: { ...newSupplier }
            }));
            setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier.SupplierName]);
            setSelectedSupplier(newSupplier.SupplierName);
            setNewSupplier({
                SupplierName: '',
                SupplierAddress: '',
                SupplierNo: '',
                SuppierEmail: '',
                Remarks: ''
            });
            setIsAdding(false);
        } else {
            setIsEditing(false);
        }
    };

    const handleAddSupplierClick = () => {
        setIsAdding(true);
        setIsEditing(false);
        setSelectedSupplier('');
        setNewSupplier({
            SupplierName: '',
            SupplierAddress: '',
            SupplierNo: '',
            SuppierEmail: '',
            Remarks: ''
        });
    };

    const handleDeleteClick = () => {
        const updatedDetails = { ...details };
        delete updatedDetails[selectedSupplier];
        setDetails(updatedDetails);
        setSuppliers(suppliers.filter(supplier => supplier !== selectedSupplier));
        setSelectedSupplier(suppliers[0] || '');
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setIsAdding(false);
    };

    
    const [selectedObject, setSelectedObject] = useState({
        SupplierName: '',
        SupplierAddress: '',
        SupplierNo: '',
        SupplierEmail: '',
        Remarks: ''
    });
    let SupplierNamesArr = initialSupplierNames.map(a => a.SupplierName)
    let SupplierNamesAr = [1, 2, 3]

    //console.log (initialSuppliers);
    //console.log(initialDetails);

    const filteredSuppliers = SupplierNamesAr.filter(supplier =>
        supplier.toString().includes(searchTerm.toLowerCase())
    );

    const handleSupplierChange = (supplier) => {
        setSelectedSupplier(supplier);
        for (let i=0; i < initialSuppliers.length; i++) {
            if (initialSuppliers[i].Supplier_ID === supplier) {
                setSelectedObject(initialSuppliers[i]);
            }
        }
        setIsEditing(false);
        setIsAdding(false);
    };
    return (
        <div className="supplier-details-container">
            <div className="suppliers-list">
                <input
                    type="text"
                    placeholder="Search supplier..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-box"
                />
                <ul>
                    {filteredSuppliers.map(supplier => (
                        <li
                            key={supplier}
                            onClick={() => handleSupplierChange(supplier)}
                            className={selectedSupplier === supplier ? 'active' : ''}
                        >
                            {supplier}
                        </li>
                    ))}
                    <li className="add-supplier" onClick={handleAddSupplierClick}>Add Supplier &gt;&gt;&gt;</li>
                </ul>
            </div>
            
            <div className="details-section">
                <h2>{isAdding ? 'Add New Supplier' : 'Supplier Details'}</h2>
                {(isEditing || isAdding) ? (
                    <form onSubmit={handleFormSubmit}>
                        
                        <div className="form-group">
                            <label>Complete Name:</label>
                            <input
                                type="text"
                                name="SupplierName"
                                value={isAdding ? newSupplier.SupplierName : details[selectedSupplier]?.SupplierName || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Complete Address:</label>
                            <input
                                type="text"
                                name="SupplierAddress"
                                value={isAdding ? newSupplier.SupplierAddress : details[selectedSupplier]?.SupplierAddress || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Number:</label>
                            <input
                                type="text"
                                name="SupplierNo"
                                value={isAdding ? newSupplier.SupplierNo : details[selectedSupplier]?.SupplierNo || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address:</label>
                            <input
                                type="email"
                                name="SupplierEmail"
                                value={isAdding ? newSupplier.SupplierEmail : details[selectedSupplier]?.SupplierEmail || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Remarks:</label>
                            <input
                                type="text"
                                name="Remarks"
                                value={isAdding ? newSupplier.Remarks : details[selectedSupplier]?.Remarks || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <button type="submit" className="save-button">{isAdding ? 'Add Supplier' : 'Save'}</button>
                            <button type="button" onClick={handleCancelClick} className="cancel-button">Cancel</button>
                            {!isAdding && (
                                <button type="button" onClick={handleDeleteClick} className="delete-button">Delete</button>
                            )}
                        </div>
                    </form>
                ) : (
                    <>
                        <p><strong>Complete Name:</strong> {selectedObject.SupplierName}</p>
                        <p><strong>Complete Address:</strong> {selectedObject.SupplierAddress}</p>
                        <p><strong>Contact Number:</strong> {selectedObject.SupplierNo}</p>
                        <p><strong>Email Address:</strong> {selectedObject.SupplierEmail}</p>
                        <p><strong>Remarks:</strong> {selectedObject.Remarks}</p>
                        <button onClick={handleEditClick} className="edit-details">Edit details &gt;&gt;&gt;</button>
                    </>
                    
                )}
            </div>
        </div>
    );
};

export default SupplierDetails;
