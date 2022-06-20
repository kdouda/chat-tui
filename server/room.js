import User from './user.js';
import Session from './session.js';
import ChatOutgoingMessage from './messages/ChatOutgoing.js';
import ChatIncomingMessage from './messages/ChatIncoming.js';
import UsersInRoom from './messages/UsersInRoom.js';

export default class Room {

    constructor(internalName, displayName, io) {
        this.internalName = internalName;
        this.displayName = displayName;
        this.io = io;
        this.users = [];
    }

    addSession(session) {
        if (session instanceof Session) {
            this.users.push(session);
            this.sendSystemMessageToRoom(`${session.user.username} has joined.`);
            this.sendMessageMemberList();
        }
    }

    removeSession(session) {
        if (session instanceof Session) {
            const index = this.users.indexOf(session);
            if (index !== -1) {
                this.sendSystemMessageToRoom(`${session.user.username} has left.`);
                this.users.splice(index, 1);
                this.sendMessageMemberList();
            }
        }
    }

    sendMessageToRoom(session, message) {
        if (session instanceof Session) {
            const msg = new ChatIncomingMessage(session.user.username, message);
            this.io.to(this.internalName).emit("message", msg.serialize());
        }
    }

    sendSystemMessageToRoom(message) {
        const msg = new ChatIncomingMessage(this.displayName, message);
        this.io.to(this.internalName).emit("message", msg.serialize());
    }

    sendMessageMemberList() {
        const msg = new UsersInRoom(this.usersInRoom);
        this.io.to(this.internalName).emit("message", msg.serialize());
    }

    get usersInRoom() {
        return this.users.map(x => x.user.username);
    }
}