const Question = require("../../../models/Question");
const { index, show, correctAnswer } = require("../../../controllers/question");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({ 
    send: mockSend, 
    json: mockJson, 
    end: mockEnd 
}));

const mockRes = { status: mockStatus };

describe("Question Controller", () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  describe("index", () => {
    it("should return all questions with status 200", async () => {
      const mockQuestions = [{ question_id: 1, question: "Is this a or b?" }];
      jest.spyOn(Question, "getAll").mockResolvedValue(mockQuestions);
      
      await index({}, mockRes);
      
      expect(Question.getAll).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockQuestions);
    });

    it("should return 500 on error", async () => {
      jest.spyOn(Question, "getAll").mockRejectedValue(new Error("Database error"));
      
      await index({}, mockRes);
      
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("show", () => {
    it("should return a question by ID with status 200", async () => {
      const mockQuestion = {
        question_id: 1,
        question: "Is this a or b?",
        option_a: "a",
        option_b: "b",
        option_c: "c",
        option_d: "d"
      };
      const req = { params: { questionId: "1" } };
      jest.spyOn(Question, "getById").mockResolvedValue(mockQuestion);

      await show(req, mockRes);
      
      expect(Question.getById).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        question_id: 1,
        question: "Is this a or b?",
        options: {
          option_a: "a",
          option_b: "b",
          option_c: "c",
          option_d: "d"
        }
      });
    });

    it("should return 404 if question not found", async () => {
      jest.spyOn(Question, "getById").mockRejectedValue(new Error("Question not found"));
      const req = { params: { questionId: "99" } };
      
      await show(req, mockRes);
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Question not found" });
    });
  });

  describe("correctAnswer", () => {
    it("should return the correct answer with status 200", async () => {
      jest.spyOn(Question, "getCorrectAnswer").mockResolvedValue("a");
      const req = { params: { questionId: "1" } };
      
      await correctAnswer(req, mockRes);
      
      expect(Question.getCorrectAnswer).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ correct_answer: "a" });
    });

    it("should return 404 if answer not found", async () => {
      jest.spyOn(Question, "getCorrectAnswer").mockRejectedValue(new Error("Answer not found"));
      const req = { params: { questionId: "99" } };
      
      await correctAnswer(req, mockRes);
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Answer not found" });
    });
  });
});
