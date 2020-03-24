var sense = sense.init();
var socket = io();

let bellNumber = Math.random();


let lastPlayed;
sense.flick(function(data){
    console.log("flick")
    // Throttle sounds, avoid double bongs
    if(Date.now() - lastPlayed < 200) {
        console.log(Date.now() - lastPlayed)
        return;
    }
    lastPlayed = Date.now()
    playSound()
    message("Bong :)")
    broadcast();
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

function broadcast(){
    socket.emit('ring', bellNumber)
}

socket.on('ring-broadcast', function(bell){
    if(bell != bellNumber) {
        playSound()
    }
})

function message(str) {
    $("#message").html(str);
}