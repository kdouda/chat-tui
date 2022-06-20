import Message from "./Message.js";
import MessageTypes from "./MessageTypes.js";

export default class UsersInRoom extends Message {
    constructor(users) {
        super({
            users: users
        });

        this.type = MessageTypes.USERS_IN_ROOM;
    }

    get users() {
        return this.data.users;
    }
}