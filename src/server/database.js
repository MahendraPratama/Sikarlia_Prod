// const express = require('express');
// const mysql = require('mysql');

// const app = express();
// const port = 8000;
// const table ='users';

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PWD,
//   database: process.env.MYSQL_DB,
// });

// app.listen(port, () => {
//   console.log(`App server now listening to port ${port}`);
// });

// app.get('/api/users', (req, res) => {
//   pool.query(`select * from ${table}`, (err, rows) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(rows);
//     }
//   });
// });


let mysql = require('mysql');
 
let connection = mysql.createConnection({
   host:        'localhost',
   user:        'root',
   password:    '',
   database:    'db_sikocak'
 });


connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Koneksi Berhasil!');
   }
 })

module.exports = connection; 