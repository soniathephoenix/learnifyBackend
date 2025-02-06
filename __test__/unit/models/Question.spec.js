const db = require("../../../database/connect");
const Question = require("../../../models/Question");

describe("Question model", () => {

  describe("getAll", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Returns an array of Question instances", async () => {
      const mockQuestions = [
        {
          question_id: 1,
          level: 1,
          points_required: 5,
          question: "What is capital of Italy?",
          option_a: "Rome",
          option_b: "Paris",
          option_c: "Berlin",
          option_d: "Madrid",
          correct_answer: "Rome"
        },
        {
          question_id: 2,
          level: 2,
          points_required: 10,
          question: "What is the capital of Morocco?",
          option_a: "Cairo",
          option_b: "Rabat",
          option_c: "Algeri",
          option_d: "Tripoli",
          correct_answer: "Rabat"
        }
      ];

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockQuestions });

      const result = await Question.getAll();

      expect(result).toHaveLength(mockQuestions.length);
      expect(result[0]).toBeInstanceOf(Question);
      expect(db.query).toBeCalledWith("SELECT * FROM questions ORDER BY question_id;"
      );
    });

    it("Throws an error when no questions are found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(Question.getAll()).rejects.toThrow("No questions available.");
      expect(db.query).toBeCalledWith("SELECT * FROM questions ORDER BY question_id;"
      );
    });
  });

  describe("getById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Returns a single Question instance", async () => {
      const mockQuestion = {
        question_id: 1,
        level: 1,
        points_required: 5,
        question: "What is capital of Italy?",
        option_a: "Rome",
        option_b: "Paris",
        option_c: "Berlin",
        option_d: "Madrid",
        correct_answer: "Rome"
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockQuestion] });

      const result = await Question.getById(mockQuestion.question_id);

      expect(result).toBeInstanceOf(Question);
      expect(result.question_id).toBe(mockQuestion.question_id);
      expect(db.query).toBeCalledWith("SELECT question, option_a, option_b, option_c, option_d, clue FROM questions WHERE question_id = $1",
        [mockQuestion.question_id]
      );
    });

    it("Throws an error when question is not found", async () => {
      const mockId = 1;

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(Question.getById(mockId)).rejects.toThrow("Question not found");
      expect(db.query).toBeCalledWith("SELECT question, option_a, option_b, option_c, option_d, clue FROM questions WHERE question_id = $1",
        [mockId]
      );
    });
  });

  describe("getCorrectAnswer", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Returns the correct answer for a given question", async () => {
      const mockQuestionId = 1;
      const mockCorrectAnswer = "Rome";

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ correct_answer: mockCorrectAnswer }] });

      const result = await Question.getCorrectAnswer(mockQuestionId);

      expect(result).toBe(mockCorrectAnswer);
      expect(db.query).toBeCalledWith("SELECT correct_answer FROM questions WHERE question_id = $1",[mockQuestionId]
      );
    });

    it("Throws an error when correct answer is not found", async () => {
      const mockQuestionId = 1;

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(Question.getCorrectAnswer(mockQuestionId)).rejects.toThrow("Answer not found");
      expect(db.query).toBeCalledWith("SELECT correct_answer FROM questions WHERE question_id = $1",[mockQuestionId]
      );
    });
  });
});