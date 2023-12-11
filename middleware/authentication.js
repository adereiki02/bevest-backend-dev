// define main library
const check = require('express-validator').check;

// validation register 
const registerValidation = [
    check('displayName', 'Nama lengkap wajib diisi!').not().isEmpty(),
    check('email', 'Isi dengan email yang valid!').isEmail().normalizeEmail({ gmail_remove_dots: true}),
    check('password', 'Password wajib diisi dengan minimal 6 kata').isLength({ min: 6 }),
];

// validation login
const loginValidation = [
    check('email', 'Isi dengan email yang valid!').isEmail().normalizeEmail({ gmail_remove_dots: true}),
    check('password', 'Password wajib diisi dengan minimal 6 kata').isLength({ min: 6 }),
];

module.exports = {
    registerValidation,
    loginValidation
}