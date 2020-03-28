var express = require('express');
var router = express.Router();
var path = require('path');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

let bells = [
    "bell 0 not a thing",
    "free",
    "free",
    "free",
    "free",
    "free",
    "free",
    "free",
    "free",
]

router.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket){
    console.log("a user connected");
    let bellNumber = 0;

    socket.on("request-bell", function() {
        if(bellNumber == 0) {
            bellNumber = bells.indexOf("free")
            if(bellNumber == -1) {
                bellNumber = 0
                console.log("no free bells, cannot pick one up")
            } else {
                bells[bellNumber] = socket
                socket.emit("set-number", bellNumber);

                console.log("handing user " + socket.id + " bell "+bellNumber)
            }
        }
    })

    socket.on('ring', function(){
        console.log("bell " + bellNumber + " rang");
        io.emit('ring-broadcast', bellNumber)
    });

    socket.on('orientation', function(data){
        console.log("bell " + bellNumber + " changed orientation to " + data);
        io.emit('orientation-broadcast', {"number":bellNumber, "orientation":data})
    });

    socket.on('disconnect', function() {
        if(bellNumber != 0) {
            console.log("bell " + bellNumber + " disconnected!");
            bells[bellNumber] = "free"
        }
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
