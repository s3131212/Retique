const express = require('express');
const path = require('path');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server,{
    pingTimeout: 60000,
    origins: '*:*'
});
var ws = require('./ws')(io)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    genid: function(req) {
        return uuidv4() // use UUIDs for session IDs
    },
    secret: 'keyboard cat'
}))
app.use(function(req,res,next){
    req.io = io;
    next();
})

const apiRouter = require('./api.js');
app.use('/api', apiRouter);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req,res) =>{
    // Don't catch socket.io
    if (req.url.substring(0, "/socket.io".length) == "/socket.io") return next();
    // Otherwise return React homepage
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

//io.set('transports', [ 'websocket' ]);

const port = process.env.PORT || 80;
server.listen(port);

console.log('App is listening on port ' + port);
