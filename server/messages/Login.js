import Message from "./Message.js";
import MessageTypes from "./MessageTypes.js";

export default class LoginMessage extends Message {

    constructor(username, password) {
        super({
            username: username,
            password: password
        });
        this.type = MessageTypes.LOGIN;
    }

    serialize() {
        return {
            type: this.type,
            data: this.data
        }
    }

    get username() {
        return this.data.username;
    }

    get password() {
        return this.data.password;
    }
}