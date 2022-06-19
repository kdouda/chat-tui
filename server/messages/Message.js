export default class Message {

    constructor(data) {
        this.type = "unknown";
        this.data = data;
    }

    serialize() {
        return {
            type: this.type,
            data: this.data
        }
    }
}