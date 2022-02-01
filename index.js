const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");

const auth = require('./middlewares/auth') 
const errors = require('./middlewares/error');

const unless = require('express-unless');
const swaggerUI = require("swagger-ui-express"), swaggerDocument = require('./swagger.json');

const app =express();


mongoose.Promise = global.Promise;


mongoose.connect(dbConfig.db,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(
    ()=>{
        console.log("db connected")
    },
    (error)=>{
        console.log("db can't be connected: " + error)
    }
);


auth.authenticateToken.unless = unless;
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] },
      { url: "/users/otplogin", methods: ["POST"] },
      { url: "/users/verifyOTP", methods: ["POST"] },
      { url: "/api-docs" },
      
      
    ],
  })
);

app.use(express.json());

app.use("/users",require("./routes/user.routes"));

app.use(errors.errorHandler);

app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocument));

app.listen(process.env.port || 4000, function(){
    console.log("ready to go ")
})