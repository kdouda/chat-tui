import style from './style.js';
import blessed from 'blessed';
import { error, success } from './helpers.js';
import { app } from '../app.js';

const bgFormColor = 'blue';
const fgFormColor = 'white';


export default function (screen) {
    return new Promise((resolve, reject) => {
        const form = blessed.form({
            parent: screen,
            keys: true,
            left: 0,
            top: 0,
            width: 50,
            height: 10,
            bg: bgFormColor,
            border: 'line',
            width: 'half',
            top: 'center',
            left: 'center',
            label: ' Login '
        });
       
        blessed.text({
            parent: form,
            content: "Login: ",
            fg: fgFormColor,
            bg: bgFormColor,
            top: 1,
            left: 2
        });
        
        const usernameinput = blessed.textbox({
            parent: form,
            mouse: true,
            keys: true,
            name: "username",
            content: "username",
            shrink: true,
            inputOnFocus: true,
            style: style.inputStyle,
            width: 46,
            top: 2,
            left: 2
        });
        
        blessed.text({
            parent: form,
            content: "Password: ",
            fg: fgFormColor,
            bg: bgFormColor,
            top: 3,
            left: 2
        });
        
        const passwordinput = blessed.textbox( {
            parent: form,
            mouse: true,
            keys: true,
            name: "password",
            content: "password",
            shrink: true,
            inputOnFocus: true,
            style: style.inputStyle,
            width: 46,
            top: 4,
            left: 2,
            censor: true
        });
        
        const loginbutton = blessed.button( {
            parent: form,
            mouse: true,
            keys: true,
            name: "login",
            shrink: true,
            inputOnFocus: true,
            hoverBg: 'yellow',
            underline: true,
            top: 6,
            left: 2,
            content: "Login",
            style: style.buttonStyle
        });
        
        const backbutton = blessed.button(
            {
                parent: form,
                mouse: true,
                keys: true,
                name: "back",
                shrink: true,
                inputOnFocus: true,
                bg: 'white', 
                fg: 'black',
                hoverBg: 'yellow',
                underline: true,
                top: 6,
                left: 8,
                content: "Back",
                style: style.buttonStyle
            }
        );

        loginbutton.on('press', () => {
            form.submit();
        });

        form.on('submit', async function(data) {
            if (data.username && data.password) {
                try {
                    const message = await app.login(data.username, data.password);
                    await success(screen, message);
                    resolve();
                } catch (e) {
                    await error(screen, e);
                    usernameinput.focus();
                    screen.render();
                }
            } else {
                error(screen, 'Username and password must be specified!').then(() => {
                    usernameinput.focus();
                    screen.render();
                });
            }

            screen.render();
        });

        backbutton.on('press', function() {
            reject();
        });

        usernameinput.focus();

        //screen.focusPush(usernameinput);

        screen.render();
    });
};

