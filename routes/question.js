const express = require('express');
const questionsController = require("../controllers/question");

const questionsRouter = express.Router();

questionsRouter.get("/", questionsController.index)

questionsRouter.get("/:questionId", questionsController.show);


questionsRouter.get("/:questionId/correct", questionsControlle