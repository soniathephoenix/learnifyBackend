const db = require("../database/connect");

class Question {
    constructor({question_id,level,points_required,question,option_a,option_b,option_c,option_d,correct_answer,}) {
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
  
  static async getById(question_id) {
    const result = await db.query("SELECT * FROM questions WHERE question_id = $1", [question_id]);

    if (result.rows.length !== 1) throw new Error("Question not found");

    return new Question(result.rows[0]);
  }
  
  async getAnswers() {
    const answers = await db.query("SELECT * FROM answers WHERE question_id = $1",[this.question_id]
    );

    if (answers.rows.length === 0) throw new Error("Error finding answers");

    return answers.rows.map((q) => new Answer(q));
  }
}

module.exports = Question