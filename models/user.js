const db = require('../database/connect');
const Question = require('../models/Question')

class User {

    constructor({ login_id, username, password, name, surname}) {
        this.login_id = login_id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
    }

    static async getOneById(id) {
        const response = await db.query("SELECT login_id, username FROM login_info WHERE login_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT login_id, username, password FROM login_info WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { name, surname, username, password } = data;
        if(username == undefined || password == undefined) throw Error("Ensure username and password are both provided")
        let response = await db.query("INSERT INTO login_info (name, surname, username, password) VALUES ($1, $2, $3, $4) RETURNING login_id;",
            [name, surname, username, password]);
        const newId = response.rows[0].login_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }

    async getCurrentQ() {
        let pointsResponse = await db.query(`
            SELECT points
            FROM points_info
            WHERE user_id = $1;
        `, [this.login_id])
        console.log(pointsResponse);
        const points = pointsResponse.rows[0].points
        let questionsResponse =  await Question.getByPoints(points + 1)
        return questionsResponse
    }
}

module.exports = User;