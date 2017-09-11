'use strict';
const Hapi = require('hapi');
const MySQL = require('mysql');
const Joi = require('joi');
const express = require('express');
const app = express();

//Create a server with a host and port
const server = new Hapi.Server();

const connection = MySQL.createConnection({
    host: '192.168.137.1',
    user: 'bruk',
    password: 'pass12',
    database: 'test'
});

server.connection({
    host: 'localhost',
    port: '8000'
});

connection.connect(function(req,rep){
    console.log("Connected!");
});

// Add the route hello world route
server.route({
    method: 'GET',
    path: '/helloworld',
    handler: function(request, reply){
        return reply("Hello World!");
    }
});

server.route({
    method: 'GET',
    path: '/user/{uid}',
    handler: function (request, reply) {
        const uid = request.params.uid;

        connection.query('SELECT uid, username, email FROM users WHERE uid = "' + uid + '"',function (error, results, fields) {
            if (error) throw error;
    
            reply(results);
        });
    },
    config: {
        validate: {
            params: {
                uid: Joi.number().integer()
            }
        }
    }
});

// The route that will return a list of users
server.route({
    method: 'GET',
    path: '/users',
    handler: function (request, reply){
        connection.query("SELECT uid, username, email FROM users", function(error, results, fields){
            if (error) throw error;
            
            reply(results);
        });
    }
});

server.route({
    method: 'POST',
    path: '/messags',
    handler: function (request, reply) {
    
        const uid = request.payload.uid;
        connection.query('SELECT * FROM messages WHERE uid_fk = "' + uid + '"',function (error, results, fields) {
            if (error) throw error;
            reply(results);
        });
    },
    config: {
        validate: {
            payload: {
                uid: Joi.number().integer()
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/messages',
    handler: function (request, reply){

        connection.query("SELECT * FROM messages", function (err, res){
            reply(res);
        });
    },
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});

// ############ THIS CODE IS NOT PART OF THE RESTFUL API BUT FOR THE TESTING OF IT ############
server.route({
    method: 'GET',
    path: '/jsutpls',
    handler: function (request, reply){
        console.log("just please work.");
        reply("<form action='/messages' method='POST'><input type='text' name='uid'><input type='submit'><form>");
    }
});
// ############ THIS CODE IS NOT PART OF THE RESTFUL API BUT FOR THE TESTING OF IT ############

server.route({
    method: 'DELETE',
    path: '/message/{uid}/{mid}',
    handler: function (request, reply){
        const uid = request.params.uid;
        const mid = request.params.mid;

        connection.query('DELETE FROM messages WHERE uid_fk = "'+uid+'" AND mid = "'+mid+'"', function (error, result, fields){
            if (error) throw error;
            
            if (result.affectedRows){
                reply (true);
            } else {
                reply(false);
            }
        });
    }
})

server.route({
    method: 'POST',
    path: "/signup",
    handler: function (request, reply){
        const username = request.payload.username;
        const email = request.payload.email;
        const password = request.payload.password;

        connection.query('INSERT INTO users (username,password,email) values ("'+username+'","'+password+'","'+email+'")', 
        function (err, reply, fields){
            if (error) throw error;

            reply(reply);
        });
    },
    config: {
        validate: {
            payload: {
                username: Joi.string().alphanum().min(3).max(30).required(),
                email: Joi.string().email(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
            }
        }
    }
})

server.start((err) => {
    if (err) throw err;
    console.log("Server running at: ", server.info.uri);
    // ###################### This is random JSON code ########################
    var chunk = {id:12, data:'mlemlem', stuff:'dis is de staffs'};
    console.log(chunk.id);
});

