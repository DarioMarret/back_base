
import mysql from 'mysql2/promise';
import 'dotenv/config'

// create the connection to database
export const sql = mysql.createPool({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE_DB,
});

sql.getConnection(function(err, connection) {
  if (err) throw err; // not connected!
  console.log('Connected!');
  sql.query('SELECT * FROM usuarios_caja', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0]);
  })
});