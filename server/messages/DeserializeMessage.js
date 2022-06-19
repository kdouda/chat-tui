import MessageTypes from "./MessageTypes.js";
import RegistrationResponse from './RegistrationResponse.js';
import Registration from './Registration.js';
import Login from './Login.js';
import LoginResponse from './LoginResponse.js';
import ChatIncomingMessage from './ChatIncoming.js';
import ChatOutgoingMessage from './ChatOutgoing.js';

const types = {};

types[MessageTypes.REGISTRATION_RESPONSE] = RegistrationResponse;
types[MessageTypes.LOGIN_RESPONSE] = LoginResponse;
types[MessageTypes.LOGIN] = Login;
types[MessageTypes.REGISTRATION] = Registration;
types[MessageTypes.CHAT_INCOMING] = ChatIncomingMessage;
types[MessageTypes.CHAT_OUTGOING] = ChatOutgoingMessage;

export default (type, data) => {
    console.log(type, data);
    return new Promise((resolve, reject) => {
        if (type in types) {
            const deserialized = new types[type](...Object.values(data))
            resolve(deserialized);
        } else {
            reject();
        }
    });
};