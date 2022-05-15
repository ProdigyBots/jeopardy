var siteWidth = 1280;
var scale = screen.width / siteWidth;

document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');

var user = "Anonymous";

async function main() {
    const socket = io();

    $('#wagerForm').submit(function(e){
        e.preventDefault();
        socket.emit('finalWager', user, $('#wage').val());
        $('#recapWager').html($('#wage').val());
        $('#wage').val('');
        $('#submitwager').css('display', 'none');
        $('#finalJeopardy').css('display', 'block');
    });

    $('#finalForm').submit(function(e){
        e.preventDefault();
        socket.emit('finalAnswer', user, $('#final').val());
        $('#recapAnswer').html($('#final').val());
        $('#final').val('');
        $('#submitfinal').css('display', 'none');
        $('#recap').css('display', 'block');
    });

    socket.on("scoreChange", (score, scoreChange) => {
        $('#socketScore').html(score);
        if(scoreChange > 0) {
            $('#buzzer').css('background-color', '#75FF33');
            $('#buzzer').css('opacity', '1.0');
        }
        else {
            $('#buzzer').css('background-color', '#9F0A0A');
            $('#buzzer').css('opacity', '1.0');
        }
    });

    socket.on("finalwages", () => {
        $('#mainScreen').css('display', 'none');
        $('#wager').css('display', 'block'); 
    });
    
    socket.on("finaljeopardy", () => {
        $('#wager').css('display', 'none'); 
        $('#finalJeopardy').css('display', 'block'); 
    });

    // Check if username is null or " " before joining
    $('#userform').submit(function(e) {
        e.preventDefault();
        // if($('user').val() == null || $('user').val() == " ") {
        //     console.log("no?");
        //     $('#user').css('border', '4px solid red');
        // }
        // else {
            user = $('#user').val();
            socket.emit("userLogin", user);
            $('#user').val('');
            $('#login').css('display', 'none'); 
        // }
    });

    $('#buzzer').click(function(e) {
        socket.emit("buzzIn", user);
    });

    // If func(name) isnt used, dont use it! 
    socket.on("buzzedWhileLocked", (name) => {
        $('#messages').append($('<li>').text("You can't buzz in right now!"));
    });

    socket.on("playerBuzz", (name) => {        
        $('#buzzer').css('opacity', '0.6');
        $('#buzzer').css('cursor', 'not-allowed');
    });

    socket.on("userGameReset", () => {
        $('#messages').empty();
        $('#buzzer').css('background-color', '#f74545');
        $('#buzzer').html('Buzz in!');
    });

    socket.on("lock", (data) => {
        if(data == true) {
            $('#messages').append($('<li>').text("Buzzing is no longer allowed!"));  
            $('#buzzer').css('opacity', '0.6');
            $('#buzzer').css('cursor', 'not-allowed');
        }
        else {
            $('#messages').append($('<li>').text("Buzzing is now allowed!"));  
            $('#buzzer').css('opacity', '1');
            $('#buzzer').css('cursor', 'pointer');
        }
    });
}

$(document).ready(function() {
    main();
});

/*
    $('#buzzer').click(function(e) {
        console.log(user);
        socket.emit("buzzIn", user);
    });

    // If func(name) isnt used, dont use it! also switch to modern js on other functions with (param) => {} syntax
    socket.on("buzzedWhileLocked", function(name) {
        $('#messages').append($('<li>').text("You can't buzz in right now!"));
    });

    socket.on("playerBuzz", (name) => {        
        $('#buzzer').css('opacity', '0.6');
        $('#buzzer').css('cursor', 'not-allowed');
    });

    socket.on("userGameReset", () => {
        $('#messages').empty();
    });

    socket.on("lock", (data) => {
        if(data == true) {
            $('#messages').append($('<li>').text("Buzzing is no longer allowed!"));  
            // Style changing has to be on server
            $('#buzzer').css('opacity', '0.6');
            $('#buzzer').css('cursor', 'not-allowed');
        }
        else {
            $('#messages').append($('<li>').text("Buzzing is now allowed!"));  
            $('#buzzer').css('opacity', '1');
            $('#buzzer').css('cursor', 'pointer');
        }
    });
}
*/