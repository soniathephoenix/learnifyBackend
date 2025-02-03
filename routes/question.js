const { Router } = require("express");

const questionsController = require("../controllers/question");

const questionsRouter = Router();

questionsRouter.get("/:questionId", questionsController.show);

module.exports = questionsRouter;