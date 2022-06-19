import { io } from "socket.io-client";
import EventEmitter from 'node:events';
import Message from './messages/Message.js';
import RegistrationMessage from "./messages/Registration.js";
import MessageTypes from './messages/MessageTypes.js';
import deserialize from './messages/DeserializeMessage.js';
import RegistrationResponse from "./messages/RegistrationResponse.js";
import LoginMessage from "./messages/Login.js";
import LoginResponse from "./messages/LoginResponse.js";
import ChatOutgoingMessage from "./messages/ChatOutgoing.js";
import ChatIncomingMessage from "./messages/ChatIncoming.js";

const STATE = {
    MENU: 'menu',
    CHAT: 'chat'
};

class WaitingPromiseTask {
    constructor(type, resolve, reject, callback) {
        this.type = type;
        this.promiseResolve = resolve;
        this.promiseReject = reject;
        this.callback = callback;
    }

    resolve(data) {
        this.promiseResolve(data);
    }

    reject(data) {
        this.promiseReject(data);
    }

    async run(data) {
        try {
            if (this.callback) {
                return await this.callback(data, this.promiseResolve, this.promiseReject);
            }
        } catch {
            return false;
        }
    }
}

class App extends EventEmitter {
    init() {
        this.waitingPromiseTasks = [];
        this.appState = STATE.MENU;

        return new Promise((resolve, reject) => {
            this.socket = io("ws://localhost:3000", {
                reconnectionDelayMax: 10000
            });
    
            this.socket.on('connect', (e) => {
                this.emit('connect');
                resolve();
            });

            this.socket.on('error', () => {
                reject();
            });

            this.socket.on('message', (e) => {
                this.handleMessage(e);
            })
        });
    }

    addWaitingPromiseTask(promise) {
        if (promise instanceof WaitingPromiseTask) {
            this.waitingPromiseTasks.push(promise);
        }
    }

    async resolveWaitingPromiseTasks(message) {
        if (this.waitingPromiseTasks.length === 0) {
            return;
        }
        
        const index = this.waitingPromiseTasks.findIndex(x => {  return x.type == message.type });

        if (index !== -1) {
            await this.waitingPromiseTasks[index].run(message);
            this.waitingPromiseTasks.splice(index, 1);
        }
    }

    async handleMessage(data) {
        try {
            const message = await deserialize(data.type, data.data);

            this.resolveWaitingPromiseTasks(message);

            if (message instanceof ChatIncomingMessage) {
                this.emit('chat', { from: message.username, text: message.text })
            }
    
        } catch (e) {
            console.log(e)
        }
    }

    sendMessage(message) {
        if (message instanceof Message) {
            this.socket.send(message.serialize());
        }
    }

    register(username, password) {
        return new Promise((resolve, reject) => {
            this.addWaitingPromiseTask(
                new WaitingPromiseTask(MessageTypes.REGISTRATION_RESPONSE, resolve, reject, async (data, res, rej) => {
                    if (data instanceof RegistrationResponse) {
                        if (data.status) {
                            res("User account created");
                        } else {
                            rej(data.message);
                        }
                    }
                })
            );

            this.sendMessage(
                new RegistrationMessage(
                    username,
                    password
                )
            );
        });
    }

    setState(state) {
        this.appState = state;
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            const that = this;

            this.addWaitingPromiseTask(
                new WaitingPromiseTask(MessageTypes.LOGIN_RESPONSE, resolve, reject, async (data, res, rej) => {
                    if (data instanceof LoginResponse) {
                        if (data.status) {
                            this.setState(STATE.CHAT);
                            res(data.message);
                        } else {
                            rej(data.message);
                        }
                    }
                })
            );

            this.sendMessage(
                new LoginMessage(
                    username,
                    password
                )
            );
        });
    }

    sendChatMessage(text) {
        if (!text) {
            throw new Error('Cannot send empty message!');
        }

        this.sendMessage(new ChatOutgoingMessage(text));
    }

    get state() {
        return this.appState
    }
}

const app = new App();

export { STATE, app };