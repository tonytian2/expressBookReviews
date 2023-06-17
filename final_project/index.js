const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    const accessToken = req.session.authorization["accessToken"]
    if(!accessToken) {return res.sendStatus(401)}
    jwt.verify( 
        accessToken,
        "mysecret",
        (err, decoded) => {
            if(err) {return res.status(403).send("Not authorized")}
            req.username = decoded.username
            next()
        })
    
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
