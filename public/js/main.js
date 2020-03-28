var sense = sense.init();
var socket = io();

let bellNumber = Math.random();
let bellUp = true

let lastPlayed;
sense.flick(function(data){
    // Throttle sounds, avoid double bongs
    if(Date.now() - lastPlayed < 200) {
        console.log(Date.now() - lastPlayed)
        return;
    }
    lastPlayed = Date.now()
    playSound()
    message("Bong :)")
    broadcastRing();
});

function playSound () {
    // Will not work until screen is tapped!
    var audio = document.getElementById('play');
    
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

function broadcastRing() {
    socket.emit('ring', bellNumber)
}

function broadcastOrientation() {
    socket.emit('orientation', {"bellId":bellNumber, "bellUp":bellUp})   
}

socket.on('ring-broadcast', function(bell){
    if(bell != bellNumber) {
        playSound()
    }
})


socket.on('orientation-broadcast', function(data){
    message("Bell id:" + data["bellId"] + " is " + (data["bellUp"] ? "up" : "down"))
})

function message(str) {
    $("#messages").prepend( "<p>"+str+"</p>" );
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
    // Do stuff with the new orientation data
}

window.addEventListener("deviceorientation", handleOrientation, true);