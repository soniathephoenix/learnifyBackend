const User = require('../../../models/User')
const db = require('../../../database/connect')

describe('User Model', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe("Create", () => {
        it("resolves correctly when username and password submitted", async () => {
            // Arrange
            const body = {
                "name": "John",
                "username": "test",
                "password": "testing",
                "surname": "Doe",
                "email": "j@doe.co"
            }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ login_id: 1 }] })
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ ...body, login_id: 1 }] })

            // Act
            const response = await User.create(body)

            // Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('login_id')
            expect(response.username).toBe(body.username)
            expect(response.login_id).toBe(1)
            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO login_info (name, surname, username, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING login_id;",
                [body.name, body.surname, body.username, body.password, body.email]
            );
            expect(db.query).toHaveBeenCalledWith(
                "SELECT login_id, username, name, surname, email FROM login_info WHERE login_id = $1",
                [1]
            );
        });

        it("throws error if password or username missing", async () => {
            // Arrange
            const body1 = { "username": "Test" }
            const body2 = { "password": "testing" }

            // Act & Assert
            await expect(User.create(body1)).rejects.toThrow("Ensure username and password are both provided");
            await expect(User.create(body2)).rejects.toThrow("Ensure username and password are both provided");
        });
    });

    describe("getOneById", () => {
        it("resolves correctly when id submitted", async () => {
            // Arrange
            const body = { "login_id": 1, "username": "Test" }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ username: body.username, login_id: body.login_id }] })

            // Act
            const response = await User.getOneById(body.login_id)

            // Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('login_id')
            expect(response.username).toBe(body.username)
            expect(response.login_id).toBe(body.login_id)
            expect(db.query).toHaveBeenCalledWith(
                "SELECT login_id, username, name, surname, email FROM login_info WHERE login_id = $1",
                [body.login_id]
            );
        });

        it("throws error if return from db is empty", async () => {
            // Arrange
            const id = 999
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

            // Act & Assert
            await expect(User.getOneById(id)).rejects.toThrow("Unable to locate user.");
        });
    });

    describe("getOneByUsername", () => {
        it("resolves correctly when name submitted", async () => {
            // Arrange
            const body = { "login_id": 1, "username": "Test" }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ username: body.username, login_id: body.login_id }] })

            // Act
            const response = await User.getOneByUsername(body.username)

            // Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('login_id')
            expect(response.username).toBe(body.username)
            expect(response.login_id).toBe(body.login_id)
            expect(db.query).toHaveBeenCalledWith(
                "SELECT login_id, username, password FROM login_info WHERE username = $1",
                [body.username]
            );
        });

        it("throws error if return from db is empty", async () => {
            // Arrange
            const name = "Not a user"
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

            // Act & Assert
            await expect(User.getOneByUsername(name)).rejects.toThrow("Unable to locate user.");
        });
    });

    describe("incrementPoints", () => {
        it("increments points successfully", async () => {
            // Arrange
            const mockResult = { rows: [{ user_id: 1, points: 5 }], rowCount: 1 };
            jest.spyOn(db, "query").mockResolvedValueOnce(mockResult);

            // Act
            const response = await User.incrementPoints(1);

            // Assert
            expect(response.points).toBe(5);
            expect(db.query).toHaveBeenCalledWith(
                "UPDATE points_info SET points = points + 1 WHERE user_id = $1 RETURNING *",
                [1]
            );
        });

        it("throws error if user not found", async () => {
            // Arrange
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [], rowCount: 0 });

            // Act & Assert
            await expect(User.incrementPoints(999)).rejects.toThrow("User not found in points_info");
        });
    });

    describe("resetPoints", () => {
        it("resets points successfully", async () => {
            // Arrange
            const mockResult = { rows: [{ user_id: 1, points: 0 }], rowCount: 1 };
            jest.spyOn(db, "query").mockResolvedValueOnce(mockResult);

            // Act
            const response = await User.resetPoints(1);

            // Assert
            expect(response.points).toBe(0);
            expect(db.query).toHaveBeenCalledWith(
                "UPDATE points_info SET points = 0 WHERE user_id = $1 RETURNING *",
                [1]
            );
        });

        it("throws error if user not found", async () => {
            // Arrange
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [], rowCount: 0 });

            // Act & Assert
            await expect(User.resetPoints(999)).rejects.toThrow("User not found or points not reset");
        });
    });

    describe("getCurrentQ", () => {
        it("returns a question when points match a question", async () => {
            // Arrange
            const mockPoints = { rows: [{ points: 2 }], rowCount: 1 };
            const mockQuestion = { rows: [{ question_id: 1, question: "Sample Question" }], rowCount: 1 };
            jest.spyOn(db, "query").mockResolvedValueOnce(mockPoints);
            jest.spyOn(db, "query").mockResolvedValueOnce(mockQuestion);
            const user = new User({ login_id: 1 });

            // Act
            const response = await user.getCurrentQ();

            // Assert
            expect(response).toHaveProperty("question_id");
            expect(response).toHaveProperty("question");
        });

        it("returns null if no matching question found", async () => {
            // Arrange
            const mockPoints = { rows: [{ points: 10 }], rowCount: 1 };
            jest.spyOn(db, "query").mockResolvedValueOnce(mockPoints);
            jest.spyOn(db, "query").mockRejectedValueOnce(new Error("Question not found"));
            const user = new User({ login_id: 1 });

            // Act
            const response = await user.getCurrentQ();

            // Assert
            expect(response).toBeNull();
        });

    });
});