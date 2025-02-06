const User = require('../../../models/User')
const Question = require('../../../models/Question')
const db = require('../../../database/connect')

describe('User Model', () => {
    beforeEach(() => jest.clearAllMocks())
  
    afterAll(() => jest.resetAllMocks())

    describe("Create" , () => {
        it("resolves correctly when username and password submitted", async () => {
            //Arrange
            const body = {
                "name": "John",
                "username": "test",
                "password": "testing",
                "surname": "Doe",
                "email": "j@doe.co"
            }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{login_id: 1}]})
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{...body, login_id: 1}]})

            //Act
            const response = await User.create(body)

            //Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('login_id')
            expect(response.username).toBe(body.username)
            expect(response.login_id).toBe(1)
            expect(db.query).toHaveBeenCalledWith("INSERT INTO login_info (name, surname, username, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING login_id;", 
                [body.name, body.surname, body.username, body.password, body.email]);
            expect(db.query).toHaveBeenCalledWith("SELECT login_id, username, name, surname, email FROM login_info WHERE login_id = $1", [1]);
        });
        it("throws error if password or username missing", async () => {
            //Arrange
            const body1 = {
                "username": "Test",
            }
            const body2 = {
                "password": "testing",
            }
            //Act & Assert
            await expect(User.create(body1)).rejects.toThrow("Ensure username and password are both provided");
            await expect(User.create(body2)).rejects.toThrow("Ensure username and password are both provided");
        });
    })

    describe("getOneById", () => {
        it("resolves correctly when id submitted", async () => {
            //Arrange
            const body = {
                "login_id": 1,
                "username": "Test"
            }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{username: body.username, login_id: body.login_id}]})

            //Act
            const response = await User.getOneById(body.login_id)

            //Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('login_id')
            expect(response.username).toBe(body.username)
            expect(response.login_id).toBe(body.login_id)
            expect(db.query).toHaveBeenCalledWith("SELECT login_id, username, name, surname, email FROM login_info WHERE login_id = $1", [body.login_id]);
        });
        it("throws error if return from db is empty", async () => {
            //Arrange
            const id = 999
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: []})
            //Act & Assert
            await expect(User.getOneById(id)).rejects.toThrow("Unable to locate user.");
        });
    })
    describe("getOneByUsername", () => {
        it("resolves correctly when name submitted", async () => {
            //Arrange
            const body = {
                "login_id": 1,
                "username": "Test"
            }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{username: body.username, login_id: body.login_id}]})

            //Act
            const response = await User.getOneByUsername(body.username)

            //Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('login_id')
            expect(response.username).toBe(body.username)
            expect(response.login_id).toBe(body.login_id)
            expect(db.query).toHaveBeenCalledWith("SELECT login_id, username, password FROM login_info WHERE username = $1", [body.username]);
        });
        it("throws error if return from db is empty", async () => {
            //Arrange
            const name = "Not a user"
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: []})
            //Act & Assert
            await expect(User.getOneById(name)).rejects.toThrow("Unable to locate user.");
        });
    })
    describe("incrementPoints", () =>{
        it("resolves correctly when user_id submitted", async () => {
            const body = 
            {
                "user_id": 1,
                "points": 1,
                "level": 1
            }

            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{points: body.points}]})
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{user_id: body.user_id, points: body.points, level: body.level}]})

            const response = await User.incrementPoints(body.user_id)

            expect(response).toHaveProperty('user_id')
            expect(response).toHaveProperty('points')
            expect(response).toHaveProperty('level')
            expect(response.user_id).toBe(body.user_id)
            expect(response.points).toBe(body.points)
            expect(response.level).toBe(body.level)
            expect(db.query).toHaveBeenCalledWith("SELECT points FROM points_info WHERE user_id = $1", [body.user_id])
            expect(db.query).toHaveBeenCalledWith("UPDATE points_info SET points = $1 + 1 WHERE user_id = $2 RETURNING *", [body.points, body.user_id])
        }) 

        it("throws error if user_id is missing from db", async () => {
            //Arrange
            const user_id = 50
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [], rowCount: 0})
            //Act & Assert
            await expect(User.incrementPoints(user_id)).rejects.toThrow("User not found in points_info");
        });

    })

    describe("getCurrentQ", () => { 
        it("resolves correctly when user_id submitted", async () => { //currently not working
            
            const user = new User({"login_id": 1, "name": "John", "username": "test", "password": "testing", "surname": "Doe", "email": "j@doe.co"})
            const body = 
            {
                "login_id": 1,
                "points": 1, 
                "question_id": 1,
                "level": 1,
                "points_required": 1,
                "question": "What is a?",
                "clue": "image",
                "option_a": "answer_a",
                "option_b": "answer_b",
                "option_c": "answer_c",
                "option_d": "answer_d",
            }

            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{points: body.points}]})

            jest.spyOn(Question, "getByPoints").mockResolvedValueOnce(
                new Question({
                    question_id: body.question_id,
                    level: body.level,
                    points_required: body.points_required,
                    question: body.question,
                    clue: body.clue,
                    option_a: body.option_a,
                    option_b: body.option_b,
                    option_c: body.option_c,
                    option_d: body.option_d,
                    correct_answer: body.correct_answer
            })
        );

            jest.spyOn(db, "query").mockResolvedValueOnce({ 
                rows: [{question_id: body.question_id, 
                    level: body.level, 
                    points_required: body.points_required, 
                    question: body.question, 
                    clue: body.clue, 
                    option_a: body.option_a, 
                    option_b: body.option_b, 
                    option_c: body.option_c, 
                    option_d: body.option_d, 
                    correct_answer: body.correct_answer}]})


            const response = await user.getCurrentQ()


            expect(response).toHaveProperty('question_id', 1)
            expect(response).toHaveProperty('level', 1)
            expect(response).toHaveProperty('points_required', 1)
            expect(response).toHaveProperty('question', 'What is a?')
            expect(response).toHaveProperty('clue', 'image')
            expect(response).toHaveProperty('option_a', 'answer_a')
            expect(response).toHaveProperty('option_b', 'answer_b')
            expect(response).toHaveProperty('option_c', 'answer_c')
            expect(response).toHaveProperty('option_d', 'answer_d')
            expect(db.query).toHaveBeenCalledWith("SELECT points FROM points_info WHERE user_id = $1;", [body.login_id])
            expect(Question.getByPoints).toHaveBeenCalledWith(body.points_required)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM questions WHERE points_required = $1", [body.points_required])
        })

        it("throws error if question_id is missing from db", async () => {
            const user = new User({"login_id": 50, "name": "John", "username": "test", "password": "testing", "surname": "Doe", "email": "j@doe.co"})
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [], rowCount: 0})
            //Act & Assert
            await expect(user.getCurrentQ()).rejects.toThrow("No question question found");

        })


    })
})