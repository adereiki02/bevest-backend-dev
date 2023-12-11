// main library
const express = require('express');
const router = express.Router();

// sec library
const dbPool = require('../config/database');
const { registerValidation, loginValidation } = require('../middleware/authentication');
const  validationResult  = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var http = require('http');

// == Business Side ==

// Account Register 
router.post("/register", registerValidation, (req, res) => {
    dbPool.query(`SELECT * FROM users WHERE LOWER(email) = LOWER('${req.body.email}'); `, (err, result) => {
        // Email Check
        if (result.length) {
            res.status(409).json({
                msg: 'Tidak bisa mendaftar karena telah terdaftar!',
                code: '409'
            });

        } else {
            // If not registered -> hash the password
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    res.status(500).json({
                        msg: err,
                        code: '500'
                    });

                } else {
                    // If not error -> put data include hashed password into db
                    dbPool.query(`INSERT INTO users (displayName, email, password, role) VALUES ('${req.body.displayName}', '${req.body.email}', '${hashedPassword}', '${req.body.role}')`, 
                    (err, result) => {
                        if (err) {
                            throw err;
                            res.status(400).send({
                                msg: err,
                                code: '400'
                            });
                        }
                        res.status(201).json({
                            msg: 'Akun berhasil didaftarkan.',
                            code: '201'
                        });
                    });
                }
            });
        }
    });
});


// Account Login
router.post("/login", loginValidation, (req, res, next) => {
    dbPool.query(`SELECT * FROM users WHERE email = ('${req.body.email}');`, (err, result) => {
        // akun tidak ditemukan
        if (err) {
            throw err;
            res.status(400).json({
                msg: err,
                code: '400'
            });
        }
        
        if (!result.length) {
            res.status(401).json({
                msg: 'Email atau password salah',
                code: '401'
            });
        }
        // cek password
        bcrypt.compare(req.body.password, result[0]["password"], (bErr, bResult) => {
            // If data is not correct
            if (bErr) {
                throw bErr,
                res.status(401).json({
                    msg: "Data yang dimasukkan tidak sesuai",
                    code: '401'
                });
            }

            // If data is correct 
            if (bResult) {
                const token = jwt.sign({ id: result[0].id }, "the-super-strong-secrect");
                // login berhasil
                return res.status(200).json({
                    msg: "Akun berhasil masuk",
                    code: '200',
                    token,
                    user: result[0],
                });
            }
            
            // If email or password wrong
            res.status(401).json({
                msg: "Email atau password salah",
                code: '401'
            });
        });
    });
});


// Show Registered Users
router.get("/registered", registerValidation, (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !req.headers.authorization.split(" ")[1]) {
        res.status(422).json({
            message: "Sediakan token dari akun yang login",
            code: "422",
        });
    }
    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "the-super-strong-secrect");
    dbPool.query("SELECT * FROM users where email = ?", decoded.id, function(err, results, fields) {
        if (err) 
            throw err;
        
        res.status(200).json({ 
            error: false, 
            data: results[0], 
            message: "Data user berhasil didapat.",
            code: "200",
         });
    });
});



module.exports = router;
