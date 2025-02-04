const db = require("../database/connect");

class Question {
  constructor({ question_id, level, points_required, question, option_a, option_b, option_c, option_d, correct_answer }) {
    this.question_id = question_id;
    this.level = level;
    this.points_required = points_required;
    this.question = question;
    this.option_a = option_a;
    this.option_b = option_b;
    this.option_c = option_c;
    this.option_d = option_d;
    this.correct_answer = correct_answer;
  }

  static async getAll() {
    console.log("hello")
    const response = await db.query("SELECT * FROM questions ORDER BY question_id;");

    if (response.rows.length === 0) {
      throw new Error("No questions available.")
    }

    return response.rows.map(g => new Question(g));
  }
  static async getById(question_id) {
    const result = await db.query("SELECT question, option_a, option_b, option_c, option_d FROM questions WHERE question_id = $1",[question_id]
    );

    if (result.rows.length !== 1) throw new Error("Question not found");

    return new Question(result.rows[0]);
  }

  static async getByPoints(points) {
    const result = await db.query("SELECT * FROM questions WHERE points_required = $1", [points]);

    if (result.rows.length !== 1) throw new Error("Question not found");

    return new Question(result.rows[0]);
  }
  
  static async getCorrectAnswer(question_id) {
    const result = await db.query("SELECT correct_answer FROM questions WHERE question_id = $1",[question_id]
    );

    if (result.rows.length !== 1) throw new Error("Answer not found");

    return result.rows[0].correct_answer;
  }
}

module.exports = Question;