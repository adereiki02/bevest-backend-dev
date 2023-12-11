const mysql = require('mysql');


// Define database connection pool - mysql2 lib
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    multipleStatements: true
});

// test connection
dbPool.getConnection((err) => {
    if (err) throw err;

    console.log("Database terhubung");

});
 
// module exports
// module.exports = dbPool.promise();
module.exports = dbPool;