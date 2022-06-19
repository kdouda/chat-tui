import style from './style.js';
import blessed from 'blessed';
import { app } from '../app.js';


const bgFormColor = 'blue';
const fgFormColor = 'white';
export default function (screen) {
    return new Promise((resolve, reject) => {

        const box = blessed.form({
            parent: screen,
            border: 'line',
            label: ' Chat ',
            width: '100%',
            height: '100%',
            top: 'center',
            left: 'center',
            keys: true
        });

        const list = blessed.list({
            parent: box,
            label: 'People on-line',
            keys: true,
            interactive: true,
            vi: true,
            mouse: true,
            focused: true,
            focusable: true,
            width: '20%',
            height: '80%-2',
            border: 'line',
            focusable: false
        });

        const inputBox = blessed.box({
            parent: box,
            border: 'line',
            label: ' Chat and settings ',
            width: '100%-2',
            height: 5,
            bottom: '0',
            padding: {
                left: 1,
                right: 1,
            },
            focusable: false
        });

        const chatBox = blessed.box({
            parent: box,
            name: 'chat',
            label: ' Chat ',
            border: 'line',
            width: '80%-3',
            height: '80%-2',
            top: 0,
            left: '20%+1',
            keys: true,
            scrollable: true,
            scrollbar: {
                bg: 'blue'
            },
            tags: true
        });

        const sendMessage = blessed.textbox({
            name: 'text',
            parent: inputBox,
            width: '80%',
            style: style.inputStyle,
            focusable: true,
            keys: true,
            interactive: true,
            mouse: true,
            top: 1,
            left: 0,
            height: 1,
            inputOnFocus: true,
        });

        const sendButton = blessed.button({
            name: 'send',
            parent: inputBox,
            width: '20%-4',
            top: 1,
            height: 1,
            style: style.buttonStyle,
            focusable: true,
            keys: true,
            interactive: true,
            mouse: true,
            left: '80%+1',
            label: 'Send',
            inputOnFocus: true,
        })

        sendButton.on('press', () => {
            box.submit();
        });

        box.on('submit', async function(data) {
            if (data && data.text && data.text.trim()) {
                try {
                    app.sendChatMessage(data.text);
                    box.cancel();
                    //inputBox.focus();
                    screen.render();
                } catch (e) {
                    console.log(e);
                }
            }
        });

        app.on('chat', (data) => {
            //chatBox.addItem(`{white-bg}{black-fg}${data.from}{/black-fg}{/white-bg}: ${data.text}`);
            chatBox.pushLine(`{white-bg}{black-fg}${data.from}{/black-fg}{/white-bg}: ${data.text}`);
            chatBox.scroll(1);
            screen.render();
        });

        screen.render();
    });
};