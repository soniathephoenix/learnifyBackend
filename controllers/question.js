const Question = require("../models/Question");

// Show the question with its options
async function show(req, res) {
  try {
    const id = parseInt(req.params.questionId);
    const question = await Question.getById(id);
    res.status(200).json({
      question_id: question.question_id,
      question: question.question,
      options: {
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d
      }
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function correctAnswer(req, res) {
  try {
    const id = parseInt(req.params.questionId);
    const correctAnswer = await Question.getCorrectAnswer(id);
    res.status(200).json({correct_answer: correctAnswer});
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = { show, correctAnswer };