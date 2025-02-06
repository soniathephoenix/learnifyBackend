const User = require('../../../models/User')
const Question = require('../../../models/Question')
const db = require('../../../database/connect')

describe('User Model', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe("Create", () => {
        it("resolves correctly when username and password submitted", async () => {
            const body = {"name": "John", "username": "test", "password": "testing", "surname": "Doe", "email": "j@doe.co"}
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{login_id: 1}]})
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{...body, login_id: 1}]})
            const response = await User.create(body)
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('login_id')
            expect(response.username).toBe(body.username)
            expect(response.login_id).toBe(1)
        });
        it("throws error if password or username missing", async () => {
            await expect(User.create({ "username": "Test" })).rejects.toThrow("Ensure username and password are both provided");
            await expect(User.create({ "password": "testing" })).rejects.toThrow("Ensure username and password are both provided");
        });
    })

    describe("getOneById", () => {
        it("resolves correctly when id submitted", async () => {
            const body = {"login_id": 1, "username": "Test"}
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{username: body.username, login_id: body.login_id}]})
            const response = await User.getOneById(body.login_id)
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('login_id')
        });
        it("throws error if return from db is empty", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: []})
            await expect(User.getOneById(999)).rejects.toThrow("Unable to locate user.");
        });
    })

    describe("incrementPoints", () => {
        it("increments points successfully", async () => {
            const mockResult = { rows: [{ user_id: 1, points: 5 }], rowCount: 1 };
            jest.spyOn(db, "query").mockResolvedValueOnce(mockResult);
            const response = await User.incrementPoints(1);
            expect(response.points).toBe(5);
            expect(db.query).toHaveBeenCalledWith("UPDATE points_info SET points = points + 1 WHERE user_id = $1 RETURNING *", [1]);
        });
        it("throws error if user not found", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [], rowCount: 0 });
            await expect(User.incrementPoints(999)).rejects.toThrow("User not found in points_info");
        });
    });

    describe("resetPoints", () => {
        it("resets points successfully", async () => {
            const mockResult = { rows: [{ user_id: 1, points: 0 }], rowCount: 1 };
            jest.spyOn(db, "query").mockResolvedValueOnce(mockResult);
            const response = await User.resetPoints(1);
            expect(response.points).toBe(0);
            expect(db.query).toHaveBeenCalledWith("UPDATE points_info SET points = 0 WHERE user_id = $1 RETURNING *", [1]);
        });
        it("throws error if user not found", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [], rowCount: 0 });
            await expect(User.resetPoints(999)).rejects.toThrow("User not found or points not reset");
        });
    });

    describe("getCurrentQ", () => {
        it("returns a question when points match a question", async () => {
            const mockPoints = { rows: [{ points: 2 }], rowCount: 1 };
            const mockQuestion = { rows: [{ question_id: 1, question: "Sample Question" }], rowCount: 1 };
            jest.spyOn(db, "query").mockResolvedValueOnce(mockPoints);
            jest.spyOn(db, "query").mockResolvedValueOnce(mockQuestion);
            const user = new User({ login_id: 1 });
            const response = await user.getCurrentQ();
            expect(response).toHaveProperty("question_id");
            expect(response).toHaveProperty("question");
        });
        it("returns null if no matching question found", async () => {
            const mockPoints = { rows: [{ points: 10 }], rowCount: 1 };
            jest.spyOn(db, "query").mockResolvedValueOnce(mockPoints);
            jest.spyOn(db, "query").mockRejectedValueOnce(new Error("Question not found"));
            const user = new User({ login_id: 1 });
            const response = await user.getCurrentQ();
            expect(response).toBeNull();
        });
        it("throws error if user points not found", async () => {
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [], rowCount: 0 });
            const user = new User({ login_id: 1 });
            await expect(user.getCurrentQ()).rejects.toThrow("User points not found");
        });
    });
});
