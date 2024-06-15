const express = require("express");
const fs = require('fs');
const app = express();
const multer = require('multer');
const path =  require('path');
// const query_arr = require('./public/js/main');

const jsonFilePath = JSON.parse(fs.readFileSync('./data/practice.json','utf-8'));
const jsonCards = JSON.parse(fs.readFileSync('./data/cards.json','utf-8'));
const htmlFilePath = fs.readFileSync('./public/templates/index.html','utf-8');
// const modified = htmlFilePath;
const htmlCard = fs.readFileSync('./public/templates/index-card.html','utf-8');
const htmlMain = fs.readFileSync('./public/templates/main.html','utf-8');

const stringToInteger = require('./Utilities/stringToInteger');
const integerToString = require('./Utilities/integerToString');

app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send(htmlMain);
})


app.get('/add', (req, res) => {
    let modified = htmlFilePath.replace(/{{%PRICE%}}/g,jsonFilePath[0].Price);
    modified = modified.replace(/{{%ADDRESS%}}/g,jsonFilePath[0].Address);
    modified = modified.replace(/{{%BATHROOMS%}}/g,jsonFilePath[0].Bathrooms);
    modified = modified.replace(/{{%BEDROOMS%}}/g,jsonFilePath[0].Bedrooms);
    modified = modified.replace(/{{%SIZE%}}/g,jsonFilePath[0].Size);
    modified = modified.replace(/{{%ID%}}/g,jsonFilePath[0].ID);
    modified = modified.replace("{{%PURPOSE%}}",jsonFilePath[0].Purpose);
    modified = modified.replace("{{%TYPE%}}",jsonFilePath[0].Type);
    res.send(modified);
});

// let cardArray = jsonCards.map((card) =>{
//     let output = htmlCard.replace("{{%ADDRESS%}}",card.Address);
//     output = output.replace("{{%BEDROOMS%}}",card.Bedrooms);
//     output = output.replace("{{%BATHROOMS%}}",card.Bathrooms);
//     output = output.replace("{{%SIZE%}}",card["Size/Area"]);
//     output = output.replace("{{%PURPOSE%}}",card.Purpose);
//     output = output.replace("{{%PRICE%}}",card.Price);
//     return output;
// });
// app.get('/cards',(req,res)=>{
//     // res.writeHead(200,{ 'Content-Type': 'text/html'});
//     res.send(cardArray.join(','));
// })

app.use(express.static('./public'));


const mysql = require('mysql');
const exp = require("constants");
const { error } = require("console");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@kistan47",
    database: "aba",
});

conn.connect(function(error){
    if(error) console.log(error) ;
    else{
        console.log("Connect Succesfully");
    }
})

var addresses = []; // Array to store addresses

// Function to fetch addresses from the database and populate the array

app.get('/location',(req,res)=>{
    const address = [];
    conn.query("SELECT DISTINCT location FROM updatedzameendataset3", (err, result) => {
            if (err) {
                throw err;
            } else {
                result.forEach(row=>{
                    address.push(row.location);
                })
                res.status(200).send({
                    status: 'success',
                    data: address
                })
            }
    });
})

let cardArray = [];
app.post('/search',(req,res)=>{
    try{
        const {location,city,property,min_range,max_range,min_area,max_area,beds} = req.body;
        const min_range_int = stringToInteger(min_range);
        const max_range_int = stringToInteger(max_range);
        conn.query("SELECT * FROM updatedzameendataset3 WHERE location = (?) AND city = (?) AND property_type = (?) AND price BETWEEN (?) AND (?) AND area BETWEEN (?) AND (?) AND bedrooms = (?)",[location,city,property,min_range_int,max_range_int,min_area,max_area,beds],(error,result)=>{
            if(error){
                console.log(error);
            }
            else{
                cardArray = result.map((res) =>{
                    let output = htmlCard.replace("{{%DESCRIPTION%}}",res.description);
                    output = output.replace("{{%BEDROOMS%}}",res.bedrooms);
                    output = output.replace("{{%ADDRESS%}}",res.location);                    
                    output = output.replace("{{%BATHROOMS%}}",res.baths);
                    output = output.replace("{{%SIZE%}}",res.area);
                    output = output.replace("{{%PURPOSE%}}",res.purpose);
                    let con_price = integerToString(res.price);
                    output = output.replace("{{%PRICE%}}",con_price);
                    return output;
                });
                
            }
        })     
        res.status(201).json({
            status: 'success',
            data:{
                redirectTo: "/cards",
            }
        }) 
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: "Error occured: "+err.message
        })
    }
})



// Ensure the uploads directory exists

// Multer storage configuration
const uniqueID = function generateRandom7DigitNumber() {
    const min = 1000000; // Minimum 7-digit number
    const max = 9999999; // Maximum 7-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueID()+Date.now()+'-'+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
// const upload = multer({dest: "uploads/"})

app.post('/propertyPosted', upload.fields([
    {name:'img1', maxCount: 1},
    {name:'img2', maxCount: 1},
    {name:'img3', maxCount: 1},

]), (req, res) => {
    const propertyID = uniqueID();
    const propertyData = {
        property_id: propertyID,
        price: req.body.price,
        area: req.body.area,
        property_type: req.body.property_type,
        purpose: req.body.purpose,
        bedrooms: req.body.bedrooms,
        baths: req.body.baths,
        location: req.body.location,
        city: req.body.city,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        description: req.body.description
    };
    console.log(propertyData);
    const insertPropertyQuery = 'INSERT INTO updatedzameendataset3 SET ?';
    conn.query(insertPropertyQuery, propertyData, err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving property data');
        }

        const files = req.files;
        const fileInsertQueries = [];

        Object.keys(files).forEach(key => {
            files[key].forEach(file => {
                const insertFileQuery = 'INSERT INTO property_images (property_id, file_name) VALUES (?, ?)';
                fileInsertQueries.push(new Promise((resolve, reject) => {
                    conn.query(insertFileQuery, [propertyID, file.filename], err => {
                        if (err) return reject(err);
                        if (file.path) {
                            resolve(file.path); // Ensure file.path is passed to resolve
                        } else {
                            reject(new Error('File path is undefined'));
                        }
                    });
                }));
            });
        });
    
        Promise.all(fileInsertQueries)
            .then(filePaths => {
                filePaths.forEach(filePath => {
                    if (filePath) {
                        fs.unlink(filePath, err => {
                            if (err) console.error(`Error deleting file: ${filePath}`, err);
                        });
                    } else {
                        console.error('File path is undefined, skipping deletion');
                    }
                });
                // res.json({ status: 'success', message: 'Property posted successfully' });
                // let posted = true;
                // res.send(posted);
                res.status(201).json({
                    status: 'success',
                    data:{
                        success: true,
                        id: propertyID
                    }
                }) 
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error saving files');
            });
    });
});

app.get('/contact-us',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/templates/contact.html'))
})

app.post('/contactInfo',(req,res)=>{
    console.log(req.body);
    res.send("Contact Details sent");
})
app.get('/cards',(req,res)=>{ 
    res.send(cardArray.join(','));
})
app.get('/postProperty',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/templates/postProperty.html'));
})
app.get('/featuredCards',(req,res)=>{
    try{
        conn.query("Select location,price,property_id,baths,bedrooms,area,purpose FROM updatedzameendataset3 WHERE LENGTH(location)>6 LIMIT 10 ",(err,result)=>{
            if(err){
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
                return ;
            }           
            res.status(200).json({
                status: "success",
                data : result
            })
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: "Error occured: "+err.message
        })
    }
})
app.get('/forSaleCards',(req,res)=>{
    try{
        conn.query("Select location,price,property_id,baths,bedrooms,area,purpose FROM updatedzameendataset3 WHERE purpose='For Sale' ORDER BY RAND() LIMIT 10 ",(err,result)=>{
            if(err){
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
                return ;
            }           
            res.status(200).json({
                status: "success",
                data : result
            })
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: "Error occured: "+err.message
        })
    }
})
app.get('/forRentCards',(req,res)=>{
    try{
        conn.query("Select location,price,property_id,baths,bedrooms,area,purpose FROM updatedzameendataset3 WHERE purpose='For Rent' ORDER BY RAND() LIMIT 10 ",(err,result)=>{
            if(err){
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
                return ;
            }           
            res.status(200).json({
                status: "success",
                data : result
            })
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: "Error occured: "+err.message
        })
    }
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})