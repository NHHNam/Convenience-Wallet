const mysql = require('mysql');
const config = require('../config')

// console.log(config.HOST)

const connection = mysql.createConnection({
//   host: "localhost",
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
});

connection.connect(err =>{
  if(err) throw err
});

module.exports = connection