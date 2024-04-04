const express = require("express");
const fs = require('fs');
const app = express();
const path =  require('path');

const jsonFilePath = JSON.parse(fs.readFileSync('./data/practice.json','utf-8'));
const jsonCards = JSON.parse(fs.readFileSync('./data/cards.json','utf-8'));
const htmlFilePath = fs.readFileSync('./public/templates/index.html','utf-8');
// const modified = htmlFilePath;
const htmlCard = fs.readFileSync('./public/templates/index-card.html','utf-8');
const htmlMain = fs.readFileSync('./public/templates/main.html','utf-8');

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

let cardArray = jsonCards.map((card) =>{
    let output = htmlCard.replace("{{%ADDRESS%}}",card.Address);
    output = output.replace("{{%BEDROOMS%}}",card.Bedrooms);
    output = output.replace("{{%BATHROOMS%}}",card.Bathrooms);
    output = output.replace("{{%SIZE%}}",card["Size/Area"]);
    output = output.replace("{{%PURPOSE%}}",card.Purpose);
    output = output.replace("{{%PRICE%}}",card.Price);
    return output;
});
app.get('/cards',(req,res)=>{
    // res.writeHead(200,{ 'Content-Type': 'text/html'});
    res.send(cardArray.join(','));
})

app.use(express.static('./public'));


const mysql = require('mysql');

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
    conn.query("SELECT DISTINCT location FROM property", (err, result) => {
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
                // console.log(result);
            }
    });
})

// console.log(addresses);


app.listen(3000, ()=>{
    console.log("Server has started");
})