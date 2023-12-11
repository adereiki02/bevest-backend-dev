// define environments config
require('dotenv').config()
PORT = process.env.PORT

// define function and library
const express = require('express');
const createError = require("http-errors");
const bodyParser = require("body-parser");
const UsersRoutes = require('./routes/users');
const cors = require('cors');

//define web server
const app = express()

// mengizinkan file json / read request body
app.use(express.json());

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set cors
let corsOptions = {
    origin: "http://localhost:8081",
};
app.use(cors(corsOptions));

// initiate index endpoint
app.get('/', (req, res) => {
    res.send("Welcome to Bevest Apps")
})

// call endpoint users
app.use('/users', UsersRoutes);

// error handling server
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

// initiate port web server
app.listen(PORT, () => {
    console.log(`Web server is running on port: ${PORT}`)
})