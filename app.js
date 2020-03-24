var express = require('express');
var router = express.Router();
var path = require('path');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

router.get('/', function(req, res) {
  res.sendfile('index.html');
});

// Color throw :)
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('ring', function(color){
    console.log(color);
    io.emit('ring-broadcast', color)
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
