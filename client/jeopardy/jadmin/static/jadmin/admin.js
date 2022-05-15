var teamOneName;
var teamTwoName;
var teamThreeName;

// Sync questions app/website with buzzer app. Admin becomes <team>: <score> [Correct/Incorrect], highlighted when active. Also highlighted on user app.
async function main() {
    const socket = io('http://192.168.1.11:8888');

    $('#enterWage').click(() => {
        $('#messages').empty();
        $('#messages').append($('<li>').text("You have initiated the final jeopardy wages round."));
        socket.emit("finalwages");
    });

    $('#enterFinalJeopardy').click(() => {
        $('#messages').append($('<li>').text("You have initiated the final jeopardy round."));
        socket.emit("finaljeopardy");
    });

    socket.on('finalWager', (user, wager) => {
        $('#messages').append($('<li>').text(user + " has wagered $" + wager + "!"));
    });

    socket.on('finalJeopardy', (user, answer) => {
        $('#messages').append($('<li>').text(user + " has answered: " + answer));
    });

    $('#unlock').click(() => {
        $('#messages').append($('<li>').text("You have unlocked buzzing."));
        socket.emit("locked", false);
        // TODO question timer 
    });

    $('#reset').click(() => {
        $('#messages').empty();
        $('#messages').append($('<li>').text("You have reset the board."));
        socket.emit("locked", true);
        socket.emit("gameReset");
    });

    socket.on('adminPlayerBuzz', (name) => {
        $('#messages').append($('<li>').text(name + " has buzzed in!"));
    });

    socket.on("loginToAdmin", (user, socket) => {
        $('#messages').append($('<li>').text(user + " joined the game."));

        if($('#teamonename').text() == "None") {
            $('#teamonename').html(user);
            teamOneName = socket;
        }
        else if($('#teamtwoname').text() == "None") {
            $('#teamtwoname').html(user);
            teamTwoName = socket;
        }
        else if($('#teamthreename').text() == "None") {
            $('#teamthreename').html(user);
            teamThreeName = socket;
        }
    });

    $('#teamonebutton').click(() => {
        socket.emit("teamScore", "one", $('#teamone').val())
        $('#teamonescore').html(+$('#teamonescore').html() + +$('#teamone').val());     
        $('#teamone').val('');
    });

    $('#teamtwobutton').click(() => {
        socket.emit("teamScore", "two", $('#teamtwo').val())
        $('#teamtwoscore').html(+$('#teamtwoscore').html() + +$('#teamtwo').val());
        $('#teamtwo').val('');
    });

    $('#teamthreebutton').click(() => {
        socket.emit("teamScore", "three", $('#teamthree').val())
        $('#teamthreescore').html(+$('#teamthreescore').html() + +$('#teamthree').val());
        $('#teamthree').val('');
    });
}

$(document).ready(function() {
    main();
});
