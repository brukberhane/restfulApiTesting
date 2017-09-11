const express = require('express');
const app = express();
const mysql = require('mysql');

const connection = mysql.createConnection({
	host: '192.168.137.1',
	user: 'bruk',
	password: 'pass12',
	database: 'test'
});

app.get('/', function (req, res){
	res.setHeader('Content-Type', 'text/html');
	res.write('Messages:');

	connection.query('SELECT * FROM messages', function (err, results, fields){
		if (err) throw err;
		for (var i=0; i < results.length; i++){
			res.write("<h3>"+results[i].message+"</h1><br>");
		}
		res.end("End Messagess.");
	});
});

app.listen(6969, function(){
	console.log("Server is running on port: 6969");
});
