"use strict";
const path 		= require('path'),
	  _			= require('lodash'),
	  User 		= require(path.resolve('./models/User'));

let rooms = [];

function socket(socket, io) {

	socket.on('login', function (data) {
		if( !data ) {
			data = {};
		}
		var context = {
			customer_name: "David Robien", 
			closeIcon: "http://158.85.67.166:8028/assets/images/closeIcn.png",
			image: "http://158.85.67.166:8028/assets/images/user_dp_bigl.png",
			verified: "http://158.85.67.166:8028/assets/images/verifiedIcn.png"
		};
		User.findByEmail(data.email, {customer_name:1,profile_image:1})
		.then(res => {
			context.customer_name = res.customer_name;
			context.image = `http://localhost:9000/${res.profile_image.path}`;
			socket.broadcast.emit('show popup', context);
		})
		.catch(err => console.log(err));	
	});
		
	// when user disconnet from socket or when user close his window or tab
	socket.on('disconnect', function (data) {
		console.log('disconnect');
	});
}

module.exports = {
	socket: socket
};