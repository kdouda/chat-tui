import Message from "./messages/Message.js";
import MessageTypes from './messages/MessageTypes.js';
import RegistrationResponse from './messages/RegistrationResponse.js';
import LoginResponse from './messages/LoginResponse.js';
import UserStore from './userstore.js';
import deserialize from './messages/DeserializeMessage.js';
import RegistrationMessage from "./messages/Registration.js";
import LoginMessage from "./messages/Login.js";
import ChatIncomingMessage from "./messages/ChatIncoming.js";
import ChatOutgoingMessage from "./messages/ChatOutgoing.js";
import { EventEmitter } from 'events';

export default class Session extends EventEmitter
{
    constructor(socket) {
        super({});
        this.socket = socket;
        this.user = null;
        this.room = null;
    }

    send(message) {
        if (message instanceof Message) {
            this.socket.send(message.serialize());
        }
    }

    joinRoom(room) {
        if (this.room) {
            this.room.removeSession(this);
        }

        this.room = room;
        this.socket.join(room.internalName);
        this.room.addSession(this);
    }

    leaveRoom(room) {
        this.room.removeSession(this);
    }

    async onMessage(data) {
        let response = null;

        try {
            const obj = await deserialize(data.type, data.data);

            if (obj instanceof RegistrationMessage) {
                response = await this.register(obj.username, obj.password);
            }

            if (obj instanceof LoginMessage) {
                response = await this.login(obj.username, obj.password);
            }

            if (obj instanceof ChatOutgoingMessage) {
                if (this.room) {
                    this.room.sendMessageToRoom(this, obj.text);
                }
            }
        } catch (e) {
            console.log(e);
            console.log('err');
            // ??? end session ???
        }

        if (response) {
            this.send(response);
        }
    }

    async login(username, password) {
        try {
            const result = await UserStore.login(username, password);
            this.user = result;
            this.emit('loggedin');
            return new LoginResponse(true, "Login successful");
        } catch (e) {
            let message = "Unknown error during login";
            
            if (e instanceof Error) {
                message = e.message;    
            }

            return new LoginResponse(false, message);
        }
    }

    async register(username, password) {
        try {
            const result = await UserStore.register(username, password);
            this.user = result;
            return new RegistrationResponse(true, "Registration successful");
        } catch (e) {
            let message = "Unknown error during registration";

            if (e instanceof Error) {
                message = e.message;    
            }

            return new RegistrationResponse(false, message);
        }
    }

    disconnect() {
        if (this.room) {
            this.leaveRoom(this.room);
        }
    }
}