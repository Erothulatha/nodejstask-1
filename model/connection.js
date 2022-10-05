
const mysql = require('mysql')
var Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'latha',
    datebase: 'project1',
    multipleStatements: true

})

Connection.connect((err) => {
    if (!err) {
        console.log("mysql sucessfully connected")
    }
    else {
        console.log("connection failed");
    }
})


module.exports = Connection


//alter query
// mysqlConnection.connect(function(err) {  
//     if (err) throw err;  
//     console.log("Connected!");  
//     var sql = "ALTER TABLE employee2 ADD COLUMN salary INT(10)";  
//    mysqlConnection.query(sql, function (err, result) {  
//     if (err) throw err;  
//     console.log("Table altered");  
//     });  
//     });  