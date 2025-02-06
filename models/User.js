const db = require('../database/connect');
const Question = require('../models/Question')

class User {

    constructor({ login_id, username, password, name, surname, email}) {
        this.login_id = login_id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }

    static async getOneById(id) {
        const response = await db.query("SELECT login_id, username, name, surname, email FROM login_info WHERE login_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async incrementPoints(userId) {
        const updateQuery = 'UPDATE points_info SET points = points + 1 WHERE user_id = $1 RETURNING *';
        const updateResult = await db.query(updateQuery, [userId]);
    
        if (updateResult.rowCount === 0) {
            throw new Error('User not found in points_info');
        }
    
        return updateResult.rows[0];
    }


    static async getOneByUsername(username) {
        const response = await db.query("SELECT login_id, username, password FROM login_info WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { name, surname, username, password, email } = data;
        if(username == undefined || password == undefined) throw Error("Ensure username and password are both provided")
        let response = await db.query("INSERT INTO login_info (name, surname, username, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING login_id;",
            [name, surname, username, password, email]);
        const newId = response.rows[0].login_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }

    static async resetPoints(userId) {
        const updateQuery = 'UPDATE points_info SET points = 0 WHERE user_id = $1 RETURNING *';
        const result = await db.query(updateQuery, [userId]);
    
        if (result.rowCount === 0) {
            throw new Error('User not found or points not reset');
        }
    
        console.log(`Points reset for user ${userId}`);
        return result.rows[0];
    }

    async getCurrentQ() {
        try {
            let pointsResponse = await db.query("SELECT points FROM points_info WHERE user_id = $1;", [this.login_id]);
            if (pointsResponse.rows.length === 0) throw new Error("User points not found");
    
            const points = pointsResponse.rows[0].points;
            let questionsResponse = await Question.getByPoints(points);
    
            if (!questionsResponse) {
                console.log("No more questions available. User has completed all questions.");
                return null;  
            }
    
            return questionsResponse;
        } catch (err) {
            console.log("Error fetching questions:", err);
            return null;
        }
    }
}

module.exports = User;
