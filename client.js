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
			if (results[i].uid_fk == 1){
				res.write("<h3 align='left'>"+results[i].message+"</h3>");
			} else if (results[i].uid_fk == 2) {
				res.write("<h3 align='right'> "+results[i].message+"</h3>");
			}
		}

		res.write("<form action='/sendmsg' method='POST'> "+
				"<input type='text' name='uid'><br> "+
 			 	"<input type='text' name='message' width='100px'> "+ 
				"<input type='submit' value='GO'> "+
				 "</form>");

		res.end("End Messagess.");
	});
});

app.post('/sendmsg', function (req, res){
	const uid = req.payload.uid;
	const message = req.payload.message;

	connection.query("INSERT INTO messages (message, uid_fk) VALUES ('"+message+"', "+uid+")", function (error, results, fields){
		if (error) throw error;
		res.redirect('/');
	});
});

app.listen(6969, function(){
	console.log("Server is running on port: 6969");
});
