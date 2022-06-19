import Message from "./Message.js";
import MessageTypes from "./MessageTypes.js";

export default class ChatOutgoingMessage extends Message {

    constructor(text) {
        super({
            text: text
        });

        this.type = MessageTypes.CHAT_OUTGOING;
    }

    get text() {
        return this.data.text
    }

    serialize() {
        return {
            type: this.type,
            data: this.data
        }
    }
}