import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import Session from './session.js';
import Room from './room.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const sessions = [];

const generalRoom = new Room("general", "General", io);

app.get('/', (req, res) => {
    res.end();
});
  
io.on('connection', (socket) => {
    const session = new Session(socket);

    session.on('loggedin', () => {
        session.joinRoom(generalRoom);
    })

    socket.on('message', (data) => {
        session.onMessage(data);
    });

    socket.on("disconnecting", () => {
        session.disconnect();
    });

    socket.on("disconnect", () => {
        // socket.rooms.size === 0
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});