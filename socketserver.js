'use strict';

require('dotenv').config({silent: true});
/*
* All the required node packages
*/
const express 	= require('express'),
	app 		= express(),
	path 		= require('path'),
	mongoose 	= require('mongoose'),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
	socketio 	= require(path.resolve('./socket/socketio')),
	cors        = require('cors'),
	http 		= require('http');

mongoose.Promise = global.Promise;
mongoose.set('debug', config.db.DEBUG);
mongoose.connect(config.db.URL, config.db.options);
let conn = mongoose.connection; 
conn.on('error', console.error.bind(console, 'connection error:'));

/**
enable cors
*/
app.use(cors());	

const httpServer 	= http.createServer(app),
	io 				= require('socket.io').listen(httpServer);


io.on('connection', function (socket) {
	console.log('Socket connection established');
	socketio.socket(socket, io);
});

httpServer.listen(config.socket_server.SOCKETPORT, () => {
    console.log(`Socket server is Listening on port:${config.socket_server.SOCKETPORT}`);
});