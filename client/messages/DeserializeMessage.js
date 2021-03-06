import MessageTypes from "./MessageTypes.js";
import RegistrationResponse from './RegistrationResponse.js';
import Registration from './Registration.js';
import Login from './Login.js';
import LoginResponse from './LoginResponse.js';
import ChatIncomingMessage from './ChatIncoming.js';
import ChatOutgoingMessage from './ChatOutgoing.js';
import UsersInRoom from './UsersInRoom.js';

const types = {};

types[MessageTypes.REGISTRATION_RESPONSE] = RegistrationResponse;
types[MessageTypes.LOGIN_RESPONSE] = LoginResponse;
types[MessageTypes.LOGIN] = Login;
types[MessageTypes.REGISTRATION] = Registration;
types[MessageTypes.CHAT_INCOMING] = ChatIncomingMessage;
types[MessageTypes.CHAT_OUTGOING] = ChatOutgoingMessage;
types[MessageTypes.USERS_IN_ROOM] = UsersInRoom;

export default (type, data) => {
    return new Promise((resolve, reject) => {
        if (type in types) {
            const deserialized = new types[type](...Object.values(data))
            resolve(deserialized);
        } else {
            reject();
        }
    });
};