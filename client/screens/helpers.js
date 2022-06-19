import blessed from 'blessed';
import style from './style.js';

const error = function (screen, text) {
    return new Promise((resolve) => {
        const msg = blessed.message({
            parent: screen,
            border: 'line',
            label: 'Error',
            content: text,
            width: 'half',
            top: 'center',
            left: 'center',
            keys: true,
        });
    
        const okbutton = blessed.button({
            parent: msg,
            border: 'line',
            content: 'Ok',
            //focused: true,
            keys: false,
            shrink: true,
            width: 10,
            bottom: 0,
            focused: true,
            style: style.buttonStyle
        });
    
        okbutton.on('press', () => {
            //msg.destroy();
            screen.remove(msg);
            screen.render();
            resolve();
        });
    });
};

const success = function (screen, text) {
    return new Promise((resolve) => {
        const msg = blessed.message({
            parent: screen,
            border: 'line',
            label: ' Success ',
            content: text,
            width: 'half',
            top: 'center',
            left: 'center',
            keys: true,
        });
    
        const okbutton = blessed.button({
            parent: msg,
            border: 'line',
            content: 'Ok',
            //focused: true,
            keys: false,
            shrink: true,
            width: 10,
            bottom: 0,
            focused: true,
            style: style.buttonStyle
        });
    
        okbutton.on('press', () => {
            //msg.destroy();
            screen.remove(msg);
            screen.render();
            resolve();
        });
    });
};

export { error, success };