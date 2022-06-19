import blessed from 'blessed';
import login from './screens/login.js';
import init from './screens/init.js';
import register from './screens/register.js';
import chat from './screens/chat.js';
import process from 'process';

import { app, STATE } from './app.js';


const screen = blessed.screen();

const run = async () => {
    // add loading screen?
    await app.init();

    while (true) {
        try {
            if (app.state === STATE.MENU) {
                const res = await init(screen);
    
                if (res === "Register") {
                  try {
                    await register(screen);
                  } catch {
                      // go back to menu screen
                      continue;
                  }
                }

                if (res === "Login") {
                    try {
                        await login(screen);
                    } catch (e) {
                        // go back to menu screen
                        continue;
                    }
                }
            }

            if (app.state === STATE.CHAT) {
                await chat(screen);
            }
        } catch (e) {
            //console.log(e);
            process.exit(0);
        }

        screen.render();
    }
};

screen.render();
run();

/*
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason, reason.stack);
    // application specific logging, throwing an error, or other logic here
});*/

screen.key('escape', function() {
    process.exit(0);
});