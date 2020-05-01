import express from 'express';
import http from 'http';
import https from 'https';
import socketio from 'socket.io';

import * as alt from 'alt';

const __dirname = `${alt.rootDir}/resources/${alt.resourceName}/server/web/`;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

app.use('/css', express.static(__dirname+'/css'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/images', express.static(__dirname+'/images'));

app.get('/', (req, res)=>{
    res.render('index');
})

io.on('connection', (socket)=>{
    alt.log('user connected');
    socket.emit('usercount', alt.Player.all.length);
    socket.on('disconnect', ()=>{
        alt.log('user left');
    });
});

server.listen(3333, ()=>{
    alt.log('WebServer running!');
});