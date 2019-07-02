// A Node.js server
var server = require('http').Server();
// Create a new Socket.io instance
var io = require('socket.io')(server);
// Requiring the ioredis package
var Redis = require('ioredis');
// A redis client
var redis = new Redis();
redis.psubscribe('*');
redis.on('pmessage', function (pattern, channel, message) {
    message = JSON.parse(message);
    // Pass data to Socket.io every time we get a new message from Redis
    // "channel + ':' + message.event" is a unique channel id to broadcast to
    // message.data corresponds to the $data variable in the MessageSent event
    // in Laravel
    io.emit(channel + ':' + message.event, message.data);
    // Just to check that things really work
    console.log(channel + ':' + message.event);
});

// Start the server at http://localhost:3000
server.listen(3000);

console.log('Server started');
