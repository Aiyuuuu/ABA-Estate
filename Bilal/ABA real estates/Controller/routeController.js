const express = require('express');
const path = require('path');
const ejs = require('ejs');
const model = require('./../Model/model');
const conn = require('./../Connection/connect');
const transporter = require('./../Email/send-email');
const convertToPakistaniCounting = require('./../Utils/currencyConversion');
const fs = require('fs');
const app = express();

// const createTemplate = (template, result, id)=>{
//     console.log(result);
//     let output = template.replace(/{{%price%}}/g,result.price);
//     output = output.replace(/{{%location%}}/g,result.location);
//     output = output.replace(/{{%bedroom%}}/g,result.bedrooms+' Bedroom ');
//     output = output.replace(/{{%bathroom%}}/g,result.baths+' Bathroom ');
//     output = output.replace(/{{%type%}}/g,result.property_type);
//     output = output.replace(/{{%size%}}/g,result.location);
//     output = output.replace(/{{%propertyID%}}/g,result.property_id);
//     output = output.replace(/{{%purpose%}}/g,result.purpose);

//     return output;
// }

// code for showing login page
exports.showAuthenticationPage = (req,res)=>{
    const filePath = path.join(__dirname,'../','public','views','authenticate.html');
    res.status(200).sendFile(filePath);
}

// code for sign up or creating new account

exports.signUp = (req,res)=>{
    const {firstname,lastname,email,password} = req.body;
    conn.query(`INSERT INTO signupdetails VALUES (?, ?, ?, ?)`,[firstname,lastname,email,password],(err,result)=>{
        if(err){
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
        else{
            console.log('data added successfully');
            res.status(201).redirect('/home')
            // res.status(200).json({ message: "Data added successfully" });
        }
    });
}

// code for login

exports.login = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const result = await new Promise((resolve,reject)=>{
            conn.query(`SELECT email,password FROM signupdetails WHERE email=(?)`,[email],(err,res)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(res);
                }
            });
        })
        if(result.length === 0){
            res.status(404).json({ error: "User not found" });
            return ;
        }
        const user = result[0];
        if(user.password !== password){
            res.status(401).json({ error: "Invalid Password"});
            return ;
        }
        else{
            // res.status(200).json({message:"login successfull"});
            res.status(200).redirect('/home');
        }
    }
    catch(err){
        res.status(500).json({message:'Internal server error'});
    }
}

// code for sending home page files

exports.showHome = (req,res)=>{
    const filePath = path.join(__dirname,'../','public','views','home.html');
    res.status(200).sendFile(filePath);
}

exports.details = (req,res)=>{
    conn.query('SELECT * FROM  propertydetails',(result)=>{
        if(err){
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
            return ;
        }
        const cont = JSON.stringify(result,null,2);
        res.status(200).json(JSON.parse(cont));
    })
}
exports.validate = (req,res,next)=>{
    const id = req.params.id;
    conn.query('SELECT * FROM propertydetails WHERE property_id=(?)',[id],(err,result)=>{
        if(result.length === 0){
            // console.error(err);
            res.status(404).sendFile(path.join(__dirname,'../','public','views','404.html'));
            return ;
        }
        next();
    })
}
exports.getLocation = (req,res) =>{
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
}
exports.getIdHouseDetails = (req,res)=>{
    const id = req.params.id;
    conn.query('SELECT * FROM propertydetails WHERE property_id=(?)',[id],(err,result)=>{
        result = result.map(obj => ({ ...obj, price: convertToPakistaniCounting(obj.price)}));            
        res.status(200).render('template',{result:result[0]});
        // fs.readFile('./public/views/template-house-details.html','utf-8',(err,html)=>{
        //     res.status(200).send(createTemplate(html,result[0],id));
        // })
    })
    // res.status(200).sendFile(path.join(__dirname,'../','public','views','template-house-details.html'));
}

// code for showing cards dynamically
exports.showCards = async(req,res)=>{
    // console.log(req.query);
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1)*limit;
    conn.query(`SELECT * FROM propertydetails LIMIT ${limit} OFFSET ${skip}`,(err,result)=>{
        if(!err){
            result = result.map(obj => ({ ...obj, price: convertToPakistaniCounting(obj.price)}));            
            const renderedCard = result.map((item)=>{ // returns array of promises
                return ejs.renderFile(path.join(__dirname,'../','public/views/cardTemplate.ejs'),{result:item});
            })
            Promise.all(renderedCard.map(rendercard => rendercard.then(cardHtml => cardHtml)))
                .then((content) => {
                    // console.log(content);
                    res.status(200).render('HouseDetailsCardsTemplate',{results:content});
                });
        }
        else{
            res.status(404).sendFile(path.join(__dirname,'../','public','views','404.html'));
        }
    })
}

// code for sending email 
exports.sendEmail = (req,res)=>{
    console.log(req.body);
    const mailOptions = {
        from: 'Bilal Bilal <bilalmuhammad0324@gmail.com>', // Sender address with name
        to: req.body.Phone, // Receiver's email address
        subject: "Interest in House Purchase Inquiry", // Subject line
        text: "hello",  // Plain text body
        html:  `<h4>Hello, I am <b>${req.body.Name}<b></h4>
                <p>${req.body.inquire}</p>
                <p>Contact: ${req.body.Phone}</p>`, // HTML body
    };
    const sendEmail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email has been sent successfully');
        } catch(error){
            console.error(error);
        }
    };
    
    sendEmail(transporter.transporter, mailOptions);
}