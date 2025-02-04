const Question = require("../models/Question");


async function index(req, res) {
  try {
    const question = await Question.getAll();
    console.log("touch here")
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
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
    const co