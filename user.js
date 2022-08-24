
const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const bodyparser = require("body-parser");
const  jwt = require("jsonwebtoken")
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const checkAuth = require("../middlewere/checkauth")
const { verify } = require("crypto");
const encoder=bodyparser.urlencoded();
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "information",
    multipleStatements: true
});
con.connect(function (err) {
        if (err)
            throw err;
        console.log("Connected!");
    });

//signup api

router.post("/signup", (req, res) => {
    let data={
        passwor:req.body.password,
        email:req.body.email,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        address:req.body.address,
        date_of_birth:req.body.date_of_birth
    }
    con.query('INSERT INTO users (passwor,email,first_name,last_name,address,date_of_birth) VALUES  (? ,? ,?,?,?,?)', [data.passwor, data.email, data.first_name,data.last_name,data.address,data.date_of_birth],(error, 
          _results) => {
           if (error) return res.json({ error: error });
          
             }); 
        res.send("signup done!!!!!")    
       });

// login api
router.post('/login',encoder,function(req,res){
    var email= req.body.email;
    var password=req.body.password;
    con.query("select * from users where email=? and passwor=?",[email,password],function(error,results){
        if(results.length>0){
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
               let data ={
             password:req.body.password,
        email:req.body.email,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        address:req.body.address,
        date_of_birth:req.body.date_of_birth
               }
                    const token = jwt.sign(data, jwtSecretKey); 
                    res.send({'msg':'data saved','key':token,'payload' : data,'status':200})         
        }
        else{
            res.send("error")
        }
    })
})
// get all users
router.get('/users', (req, res) => {
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
      
        try {
            const token = req.header(tokenHeaderKey);
            if(jwt.verify(token, jwtSecretKey)){
                con.query('SELECT * FROM users', (err, rows) => {
                    if (!err){
                        res.send(rows)
                        return
                    }
                    else
                        console.log(err);
                });
            }else{
                // Access Denied
                console.log(error)
                //return _res.status(401).send(error);
            }
        } catch (error) {
            // Access Denied
            return res.status(401).send(error);
        }
    
        
    });
// get by id


router.get('/user/:id',(req, res) => {

        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
      
        try {
            const token = req.header(tokenHeaderKey);
            if(jwt.verify(token, jwtSecretKey)){
                con.query('SELECT * FROM users WHERE id=?', [req.params.id], (err, rows) => {
                           if (!err)
                               res.send(rows);
                      else
                              console.log(err);
                        });
                    }else{
                // Access Denied
                console.log(error)
                //return _res.status(401).send(error);
            }
        } catch (error) {
            // Access Denied
            return res.status(401).send(error);
        }   
     });
// delete by id
router.delete('/user/:id', (req, res) => {
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
      
        try {
            const token = req.header(tokenHeaderKey);
            if(jwt.verify(token, jwtSecretKey)){
                con.query('DELETE FROM users WHERE id=?', [req.params.id], (err) => {
                    if (!err)
                        res.send("DELETED");
                    else
                        console.log(err);
                });
            }else{
                // Access Denied
                console.log(error)
                //return _res.status(401).send(error);
            }
        } catch (error) {
            // Access Denied
            return res.status(401).send(error);
        }
        
    });
// update user
router.put('/user/:id', (req, res) => {
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        
      
        try {
            const token = req.header(tokenHeaderKey);
            if(jwt.verify(token, jwtSecretKey)){
              
        con.query("UPDATE `users` SET `password`=?, `email`=?,`first_name`=?,`last_name`=?,`address`=?,`date_of_birth`=? where `id`=?", [req.body.password, req.body.email, req.body.first_name,req.body.last_name,req.body.address,req.body.date_of_birth], function (err, rows, _fields) {
            if (err)
                throw err;
            res.end(JSON.stringify(rows));
        });
            }else{
                // Access Denied
                console.log(error)
                //return _res.status(401).send(error);
            }
        } catch (error) {
            // Access Denied
            return res.status(401).send(error);
        }
    
    });
    
module.exports = router;