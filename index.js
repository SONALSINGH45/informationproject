
const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
var app = express();
app.use(cookieParser());
dotenv.config();
app.use(bodyparser.json());
app.use(express.json());

let PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is up and running on 9000 ...`);
  });
  
  app.use('/user',userRoute);
