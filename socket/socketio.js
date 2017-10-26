"use strict";
const path 		= require('path'),
	  _			= require('lodash');

let rooms = [];

function socket(socket, io) {

	socket.on('login', function (data) {
		let email = data.email;
		rooms = _.union(rooms, [email]);
		socket.join(data.email);
		io.emit('login', { msg: 'login success' });
	});
		
	// when user disconnet from socket or when user close his window or tab
	socket.on('disconnect', function (data) {
		console.log('disconnect');
	});
}

module.exports = {
	socket: socket
};