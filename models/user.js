const db = require('../database/connect');

class User {

    constructor({ login_id, username, password}) {
        this.login_id = login_id;
        this.username = username;
        this.password = password;
    }

    static async getOneById(id) {
        const response = await db.query("SELECT login_id, username FROM user_login_info WHERE login_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT login_id, username FROM user_login_info WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { username, password } = data;
        let response = await db.query("INSERT INTO user_login_info (username, password) VALUES ($1, $2) RETURNING login_id;",
            [username, password]);
        const newId = response.rows[0].login_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }
}

module.exports = User;