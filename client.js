const express = require('express');
const app = express();
const mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require("fs");
var path = require('path');

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

const connection = mysql.createConnection({
	host: '192.168.137.1',
	user: 'bruk',
	password: 'pass12',
	database: 'test'
});

app.get('/', function (req, res){
	res.setHeader('Content-Type', 'text/html');
	//res.write('Messages:');

	//res.write("<body bgcolor='gray'><script type='text/javascript>"+
	//	"console.log('pls work?');"+
	//	"</script>"
	//);

	connection.query('SELECT * FROM messages', function (err, results, fields){
		if (err) throw err;
		/*for (var i=0; i < results.length; i++){
			if (results[i].uid_fk == 1){
				res.write("<div style'{background-color: green}' align='left'>"+results[i].message+"</div>");
			} else if (results[i].uid_fk == 2) {
				res.write("<h3 align='right'> "+results[i].message+"</h3>");
			}
		}*/
		res.sendFile(path.join(__dirname+'/client/index.html'));
		//res.write("<br><br><br><br>");//Separator between messages

		//res.write("<form action='/sendmsg' method='POST'> "+
		//		"<input type='text' name='uid'><br> "+
 		//	 	"<input type='text' name='message' width='100px'> "+ 
		//		"<input type='submit' value='GO'> "+
		//		 "</form></body>");

		//res.end("End Messagess.");
	});
});

app.get('/jquery', function (req, res){
	res.sendFile(path.join(__dirname+'/client/jquery.js'));
});

app.get('/messages', function (req, res){

	connection.query('SELECT * FROM messages', function (err, results, fields){
		if (err) throw err;

		res.end(results);
	});

});

app.post('/sendmsg', function (req, res){
	const uid = req.body.uid;
	const message = req.body.message;

	connection.query("INSERT INTO messages (message, uid_fk) VALUES ('"+message+"', "+uid+")", function (error, results, fields){
		if (error) throw error;
		res.redirect('/');
	});
});

app.listen(6969, function(){
	console.log("Server is running on port: 6969");
});
