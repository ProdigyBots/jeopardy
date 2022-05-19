const  
http = require("http"),
express = require("express"),
socketio = require("socket.io"),
app = express(),
server = http.createServer(app),
io = socketio(server),
SERVER_PORT = 8888, 
SERVER_IP = '192.168.1.3'; // TODO make this an enviroment variable or specified via dockerfile
// make clients interact with that same variable, we don't want an absolute path

let onlineClients = new Set();
let buzzedIn = new Set();
var locked = true;
var numTeams = 0;
var teams = { 
    one: {
        name: "Team 1",
        score: 0,
    },
    two: {
        name: "Team 2",
        score: 0,
    },
    three: {
        name: "Team 3",
        score: 0,
    }
};

function onNewWebsocketConnection(socket) {
    console.info(`Socket ${socket.id} has connected.`);
    onlineClients.add(socket.id);

    socket.on("disconnect", () => {
        onlineClients.delete(socket.id);
        console.info(`Socket ${socket.id} has disconnected.`);
    });

    socket.on("login", (name) => { 
        numTeams += 1;
        if(numTeams >= 4) { 
            io.sockets.emit("gameFull");
            console.info("3 teams registered, the game is now full.");
            return;
        }

        if(numTeams == 1) {
            teams.one.name = name;
            teams.one.score = 0;
        }
        else if(numTeams == 2) {
            teams.two.name = name;
            teams.two.score = 0;
        }
        else if(numTeams == 3) {
            teams.three.name = name;
            teams.three.score = 0;
        }

        io.sockets.emit("loginToAdmin", name, socket.id);
        io.sockets.emit("loginCallback", teams);
    });

    socket.on("buzzIn", (name) => {
        if(locked == false) {
            if(!buzzedIn.has(socket.id)) {
                buzzedIn.add(socket.id);
                io.to(socket.id).emit("playerBuzz");
                io.sockets.emit("adminPlayerBuzz", name);
            }
        }
    });

    socket.on("locked", (data) => {
        if(data == true) {
            locked = true;
            io.sockets.emit('lock', true);
        }
        else {
            locked = false;
            io.sockets.emit('lock', false);
        }
    });

    socket.on("gameReset", () => {
        io.sockets.emit("userGameReset");
        buzzedIn.clear();
    });

    socket.on("finalwages", () => {
        io.sockets.emit("finalwages");
    }); 

    socket.on("finaljeopardy", () => {
        io.sockets.emit("finaljeopardy");
    });

    socket.on('finalWager', (user, wager) => {
        io.sockets.emit('finalWager', user, wager);
    });

    socket.on("finalJeopardy", (user, answer) => {
        io.sockets.emit("finalJeopardy", user, answer);
    });
    
    socket.on("teamScore", (team, score) => {
        if(team === "one") {
            teams.one.score = +teams.one.score + +score;
            io.sockets.emit("scoreChange", team, teams.one.score);
            console.info("Team 1 has received $" + score + " and is now at $" + teams.one.score);
        }
        else if(team === "two") {
            teams.two.score = +teams.two.score + +score;
            io.sockets.emit("scoreChange", team, teams.two.score);
            console.info("Team 2 has received $" + score + " and is now at $" + teams.two.score);
        }
        else if(team === "three") {
            teams.three.score = +teams.three.score + +score;
            io.sockets.emit("scoreChange", team, teams.three.score);
            console.info("Team 3 has received $" + score + " and is now at $" + teams.three.score);
        }
    });
}

io.on("connection", onNewWebsocketConnection);
server.listen(SERVER_PORT, SERVER_IP, () => console.info(`Server listening on address ${SERVER_IP}:${SERVER_PORT}..\n`));
