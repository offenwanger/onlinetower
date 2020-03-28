var sense = sense.init();
var socket = io();

let bellNumber = 0;
let bellUp = true

let lastPlayed;
sense.flick(function(data){
    // Throttle sounds, avoid double bongs
    if(Date.now() - lastPlayed < 200) {
        console.log(Date.now() - lastPlayed)
        return;
    }
    lastPlayed = Date.now()

    if(bellNumber > 0) {
        playSound(bellNumber)
        message("Bong :)")
        broadcastRing();
    }
});

function playSound (number) {
    // Will not work until screen is tapped!
    var audio = document.getElementById('bell'+number);
    
    if (audio.paused) {
        audio.play()
        .catch(()=>{
            message("Please tap your screen");    
        });
    } else {
        // Restart the sound. 
        audio.currentTime = 0
    }
}

function takeBellClicked() {
    socket.emit('request-bell');
}

function broadcastRing() {
    socket.emit('ring', bellNumber);
}

function broadcastOrientation() {
    socket.emit('orientation', bellUp)   
}

socket.on('set-number', function(number){
    bellNumber = number;
    message("You are now bell " + bellNumber)
})

socket.on('ring-broadcast', function(bell){
    if(bell != bellNumber) {
        playSound(bell)
    }
})


socket.on('orientation-broadcast', function(data){
    message("Bell " + data["number"] + " is " + (data["orientation"] ? "up" : "down"))
})

function message(str) {
    $("#messages").prepend( "<p>" +str+"</p>" );
}

function isDown(beta) {
    //Upside down
    if(beta < 0) return true;
    
    beta = Math.abs(beta);
    beta = beta > 90 ? 180 - beta : beta;
    // Down
    if(beta < 45) return true;
    
    // Up
    return false;
}

function handleOrientation(event) {
    if(bellNumber > 0) {
        if(isDown(event.beta)){
            if(bellUp) {
                bellUp = false;
                broadcastOrientation();
            }
        } else {
            if(!bellUp){
                bellUp = true;
                broadcastOrientation();
            }
        }
    }
}

window.addEventListener("deviceorientation", handleOrientation, true);