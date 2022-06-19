import style from './style.js';
import blessed from 'blessed';

export default function (screen) {
    return new Promise((resolve, reject) => {
        const box = blessed.message({
            parent: screen,
            border: 'line',
            label: ' Welcome to Chat ',
            width: 'half',
            top: 'center',
            left: 'center',
            keys: true,
            padding: {
                top: 2,
                left: 2,
                right: 2,
                bottom: 2
            }
        });



        const list = blessed.list({
            parent: box,
            label: 'Menu option',
            keys: true,
            interactive: true,
            vi: true,
            mouse: true,
            focused: true,
            focusable: true,
            style: {
                item: {
                  hover: {
                    bg: 'blue'
                  }
                },
                selected: {
                  bg: 'blue',
                  bold: true
                }
            },
        });
        
        list.addItem("Login");
        list.addItem("Register");
        list.addItem('Quit');

        list.on('select', (el, selected) => {
            var name = el.getText();
            
            if (name === "Quit") {
                reject();
                return;
            }
            
            screen.remove(box);
            resolve(name);
            screen.render();
        });

        screen.render();
    });
};