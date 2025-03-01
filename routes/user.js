const { Router } = require('express');

const userController = require('../controllers/user.js');
const authenticator = require("../middleware/authenticator");

const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get('/currentq/', authenticator, userController.currentQuestion)

userRouter.post('/update-points', authenticator, userController.updatePoints)

userRouter.post('/reset-points', authenticator, userController.resetPoints);

module.exports = userRouter;