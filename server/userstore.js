import db from './db.js';
import bcrypt from 'bcrypt';
import User from './user.js';

const TABLE = 'users';

class UserStore {

    async login(username, password) {
        username = username.trim().toLowerCase();

        const result = await db(TABLE).select('*').where('username', username).first();
        
        if (result) {
            if (await bcrypt.compare(password, result.password)) {
                return new User(result.id, result.username);
            }
        }

        throw new Error('User not found or credentials are invalid');
    }

    async register(username, password) {
        username = username.trim().toLowerCase();

        if (await db(TABLE).select('*').where('username', username).first().then((row) => row)) {
            throw new Error('User already exists!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db(TABLE).insert({ username: username, password: hashedPassword });
    }

}

const instance = new UserStore();

export default instance;