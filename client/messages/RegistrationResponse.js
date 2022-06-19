import Message from "./Message.js";
import MessageTypes from "./MessageTypes.js";

export default class RegistrationResponse extends Message {
    constructor(status, message) {
        super({
            status: status,
            message: message
        });
        this.type = MessageTypes.REGISTRATION_RESPONSE;
    }

    get status() {
        return this.data.status;
    }

    get message() {
        return this.data.message;
    }
}