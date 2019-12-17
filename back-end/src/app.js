const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
	socket.on('login', user => {
		io.sockets.emit('newUser', user);
	});

	socket.on('startGame', question => {
		io.sockets.emit('newGame', question);
	});

	socket.on('updatePoints', user => {
		io.sockets.emit('receivePoints', user);
	});

	socket.on('nextQuestion', question => {
		io.sockets.emit('newQuestion', question);
	});

	socket.on('validateAnswer', answer => {
		io.sockets.emit('receiveAnswer', answer);
	});

	socket.on('questionEnd', end => {
		io.sockets.emit('receiveQuestionEnd', end);
	});

	socket.on('endGame', end => {
		io.sockets.emit('receiveEndGame');
	});

});

http.listen(4444);