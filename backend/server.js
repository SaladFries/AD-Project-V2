const express = require ('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "admin",  
    database: "supplies_inventory",
    dateStrings: true
})


app.get('/', (req, res)=>{
    return res.json("From Backend Side");
})

//FOR PRODUCTS
app.get('/products', (req, res)=>{
    const sql = "SELECT * FROM Products_table";
    db.query(sql, (err, InitialProducts)=>{
        if(err) return res.json(err);
        return res.json(InitialProducts);
        
    })
})

app.post('/products/add', (req, res)=>{
    const sql="insert into products_table (Product_ID, Product_Name, Size, Flavor) VALUES (?, ?, ?, ?)";
    const id = req.body.Product_ID;
    const name = req.body.Product_Name;
    const size = req.body.Size;
    const flavor = req.body.Flavor;

    db.query(sql, [id, name, size, flavor],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})

app.put('/products/:id', (req, res)=>{
    const sql = "UPDATE products_table SET Product_Name = ?, Flavor = ?, Size = ? WHERE Product_ID = ?";
    const id = req.params.id;
    const {Product_Name, Flavor, Size} = req.body
    db.query(sql, [Product_Name, Flavor, Size, id], (err, result) => {
        if(err) return res.json("Error");
        return res.json({updated: true})
    })
})

app.delete('/products/:id', (req, res)=>{
    const sql = "DELETE FROM products_table WHERE Product_ID = ?";
    const {id} = req.params;
    db.query(sql, [id], (err) => {
        if(err) throw err;
        res.json({message:'User deleted successfully'});
    });
});
//END PRODUCTS

//FOR BATCHES
app.get('/batches', (req, res)=>{
    const sql = "SELECT * FROM Production_batches_table";
    db.query(sql, (err, InitialBatches)=>{
        if(err) return res.json(err);
        return res.json(InitialBatches);
        
    })
})

//FOR FRONTEND, NAKALAGAY SA LIST YUNG MGA PRODUCTS WHEN CHOOSING TO ADD
app.post('/batches/add', (req, res)=>{
    const sql="insert into Production_batches_table VALUES (?, ?, ?, ?, ?, ?, ?)";
    const id = req.body.Batch_ID;
    const prod_id = req.body.Product_ID;
    const qty = req.body.Quantity;
    const expdate = req.body.Expiration_Date;
    const exptime = req.body.Expiration_Time;
    const manudate = req.body.Manufacturing_Date;

    db.query(sql, [id, prod_id, qty, expdate, exptime, manudate, "For Stock"],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})

//EDITING STATUS OF BATCHES
app.put('/batches/:id', (req, res)=>{
    const sql = "UPDATE Production_batches_table SET Status = ? WHERE Batch_ID = ?";
    const id = req.params.id;
    const status = req.body.Status
    db.query(sql, [status, id], (err, result) => {
        if(err) return res.json("Error");
        return res.json({updated: true})
    })
})
//END BATCHES

//FOR SUPPLIERS
app.get('/suppliers', (req, res)=>{
    const sql = "SELECT * FROM Supplier_table";
    db.query(sql, (err, InitialSuppliers)=>{
        if(err) return res.json(err);
        return res.json(InitialSuppliers);
        
    })
})

app.get('/suppliers/suppliernames', (req, res)=>{
    const sql = "SELECT SupplierName FROM Supplier_table";
    db.query(sql, (err, InitialSupplierNames)=>{
        if(err) return res.json(err);
        return res.json(InitialSupplierNames);
        
    })
})

app.post('/suppliers/add', (req, res)=>{
    const sql="insert into Supplier_table VALUES (?, ?, ?, ?, ?, ?)";
    const id = req.body.Supplier_ID;
    const SName = req.body.SupplierName;
    const Sadd = req.body.SupplierAddress;
    const SNo = req.body.SupplierNo;
    const SEmail = req.body.SupplierEmail;
    const remarks = req.body.Remarks;

    db.query(sql, [id, SName, Sadd, SNo, SEmail, remarks],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})

app.put('/suppliers/:id', (req, res)=>{
    const sql="UPDATE Supplier_table SET SupplierName = ?, SupplierAddress = ?, SupplierNo = ?, SupplierEmail = ?, Remarks = ? WHERE Supplier_ID = ?";
    const id = req.body.Supplier_ID;
    const SName = req.body.SupplierName;
    const Sadd = req.body.SupplierAddress;
    const SNo = req.body.SupplierNo;
    const SEmail = req.body.SupplierEmail;
    const remarks = req.body.Remarks;

    db.query(sql, [SName, Sadd, SNo, SEmail, remarks, id],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})

app.delete('/suppliers/:id', (req, res)=>{
    const sql = "DELETE FROM Supplier_table WHERE Supplier_ID = ?";
    const {id} = req.params;
    db.query(sql, [id], (err) => {
        if(err) throw err;
        res.json({message:'Supplier deleted successfully'});
    });
});
//END SUPPLIERS

//FOR SUPPLIES
app.get('/supplies', (req, res)=>{
    const sql = "SELECT * FROM Supplies_table";
    db.query(sql, (err, InitialSupplies)=>{
        if(err) return res.json(err);
        return res.json(InitialSupplies);
        
    })
})

app.post('/supplies/add', (req, res)=>{
    const sql="insert into Supplies_table VALUES (?, ?, ?, ?)";
    const id = req.body.Supply_ID;
    const SName = req.body.SupplyName;
    const SPrice = req.body.SupplyPrice;
    const SQty = req.body.SupplyQty;

    db.query(sql, [id, SName, SPrice, SQty],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})

app.put('/supplies/:id', (req, res)=>{
    const sql="UPDATE into Supplies_table SET SupplyName = ?, SupplyPrice = ?, SupplyQty = ? WHERE Supply_ID = ?";
    const id = req.body.Supply_ID;
    const SName = req.body.SupplyName;
    const SPrice = req.body.SupplyPrice;
    const SQty = req.body.SupplyQty;

    db.query(sql, [SName, SPrice, SQty, id],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})

app.delete('/supplies/:id', (req, res)=>{
    const sql = "DELETE FROM Supplies_table WHERE Supply_ID = ?";
    const {id} = req.params;
    db.query(sql, [id], (err) => {
        if(err) throw err;
        res.json({message:'Supply deleted successfully'});
    });
});
//END SUPPLIES

//FOR PR
app.get('/pr', (req, res)=>{
    const sql = "SELECT * FROM Purchase_request_table";
    db.query(sql, (err, InitialPR)=>{
        if(err) return res.json(err);
        return res.json(InitialPR);
        
    })
})

app.post('/pr/add', (req, res)=>{
    const sql="insert into Purchase_request_table VALUES (?, ?)";
    const id = req.body.PR_ID;
    const date = req.body.Date;

    db.query(sql, [id, date],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})
//END PR

//FOR PR ITEMS
app.get('/pritems', (req, res)=>{
    const sql = "SELECT * FROM purchase_item_table";
    db.query(sql, (err, InitialPRItems)=>{
        if(err) return res.json(err);
        return res.json(InitialPRItems);
        
    })
})

app.post('/pritems/add', (req, res)=>{
    const sql="insert into purchase_item_table VALUES (?, ?, ? ,?, ?)";
    const id = req.body.PRI_ID;
    const prid = req.body.PR_ID;
    const supplierid = req.body.SupplierID;
    const supplyid = req.body.SupplyID;
    const qty = req.body.Quantity;

    db.query(sql, [id, prid, supplierid, supplyid, qty],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})
//END PR ITEMS

//FOR ORDER TRACKING
app.get('/orders', (req, res)=>{
    const sql = "SELECT * FROM order_tracking_table";
    db.query(sql, (err, InitialTracking)=>{
        if(err) return res.json(err);
        return res.json(InitialTracking);
        
    })
})

app.post('/orders/add', (req, res)=>{
    const sql="insert into order_tracking_table VALUES (?, ?, ? ,?, ?, ?, ?, ?, ?, ?)";
    const id = req.body.OrderTrack_ID;
    const bid = req.body.Batch_ID;
    const oid = req.body.OrderID;
    const Datever = req.body.DateVerified;
    const Timever = req.body.TimeVerified;
    const status = req.body.Status;
    const oitem = req.body.Ordered_Item;
    const qty = req.body.Quantity;
    const odate = req.body.Order_Date;
    const refdate = req.body.Refund_Req_Date;

    db.query(sql, [id, bid, oid, Datever, Timever, status, oitem, qty, odate, refdate],(err, result)=>{
        if(err) console.log(err)
        return res.json({updated: true})
    })
})
//END ORDER TRACKING


/*needs to be done
APP.DELETE KUNG MERON NUN, PER ROW NA CLICK
APP.get at post at update for each database*/ 

app.listen(8081, ()=>{
    console.log("listening");
})