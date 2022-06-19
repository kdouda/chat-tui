class User {

    constructor(id, username) {
        this.id = id;
        this.username = username;
    }

    set session(session) {
        this.session = session;
    }

    get session() {
        return this.session
    }
}

export default User;