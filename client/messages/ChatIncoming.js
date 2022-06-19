import Message from "./Message.js";
import MessageTypes from "./MessageTypes.js";

export default class ChatIncomingMessage extends Message {

    constructor(username, text) {
        super({
            username: username,
            text: text,
        });

        this.type = MessageTypes.CHAT_INCOMING;
    }

    get text() {
        return this.data.text.trim();
    }

    get username() {
        return this.data.username;
    }

    serialize() {
        return {
            type: this.type,
            data: this.data
        }
    }
}