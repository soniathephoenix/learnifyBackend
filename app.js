const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/user')
//const questionsRouter = require('./routes/question')

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "Geography puzzle",
        description: "A puzzle for GCSE geography students"
    })
})

app.use("/users", userRouter);
//app.use("/questions", questionsRouter)

module.exports = app;