const express = require("express");
const fs = require('fs');
const app = express();
const path =  require('path');
// const query_arr = require('./public/js/main');

const jsonFilePath = JSON.parse(fs.readFileSync('./data/practice.json','utf-8'));
const jsonCards = JSON.parse(fs.readFileSync('./data/cards.json','utf-8'));
const htmlFilePath = fs.readFileSync('./public/templates/index.html','utf-8');
// const modified = htmlFilePath;
const htmlCard = fs.readFileSync('./public/templates/index-card.html','utf-8');
const htmlMain = fs.readFileSync('./public/templates/main.html','utf-8');

app.use(express.json());

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
        const movie = req.body;
        console.log(movie);
        const {location,city,property,min_range,max_range,min_area,max_area,beds} = req.body;
        function convertToInteger(value) {
            const mapping = {
                lac: 100000,
                crore: 10000000
            };
        
            const [number, unit] = value.toLowerCase().split(/\s+/); 
            return mapping[unit] ? parseInt(number) * mapping[unit] : null;
        }
        const min_range_int = convertToInteger(min_range);
        const max_range_int = convertToInteger(max_range);
        conn.query("SELECT * FROM updatedzameendataset3 WHERE location = (?) AND city = (?) AND property_type = (?) AND price BETWEEN (?) AND (?) AND area BETWEEN (?) AND (?) AND bedrooms = (?)",[location,city,property,min_range_int,max_range_int,min_area,max_area,beds],(error,result)=>{
            if(error){
                console.log(error);
            }
            else{
                const convertToString = function (value){
                    if(value>=100000 && value<=9999999){
                        return(`${value/100000} lacs`);
                    }else if (value === 10000000) {
                        return `${value / 10000000} crore`;
                    }
                    else{
                        return(`${value/10000000} crores` );
                    }
                }
                cardArray = result.map((res) =>{
                    let output = htmlCard.replace("{{%DESCRIPTION%}}",res.description);
                    output = output.replace("{{%BEDROOMS%}}",res.bedrooms);
                    output = output.replace("{{%ADDRESS%}}",res.location);                    
                    output = output.replace("{{%BATHROOMS%}}",res.baths);
                    output = output.replace("{{%SIZE%}}",res.area);
                    output = output.replace("{{%PURPOSE%}}",res.purpose);
                    let con_price = convertToString(res.price);
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
app.get('/cards',(req,res)=>{ 
    res.send(cardArray.join(','));
})


app.listen(3000, ()=>{
    console.log("Server has started");
})