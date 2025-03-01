const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require('../models/User');

async function updatePoints(req, res) {
  try {
    const userId = req.body.login_id;
    const updatedUser = await User.incrementPoints(userId);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function register(req, res) {
    try {
      const data = req.body;
  
      // Generate a salt with a specific cost
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
  
      // Hash the password
      data["password"] = await bcrypt.hash(data.password, salt);
      const result = await User.create(data);
      res.status(201).json(result);
    } catch(err) {
      res.status(400).json({ error: err.message });
    }
}

async function resetPoints(req, res) {
  try {
    const userId = req.body.login_id;
    await User.resetPoints(userId);
    res.status(200).json({ message: "Points reset successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
    const data = req.body;
    try {
      const user = await User.getOneByUsername(data.username);
      if(!user) { throw new Error('No user with this username') }

      const match = await bcrypt.compare(data.password, user.password);

      if (match) {
        const payload = { login_id: user.login_id  }

        jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, (err, token) =>{
          if(err){ throw new Error('Error in token generation') }
          res.status(200).json({
              success: true,
              token: token,
          });
        });

      } else {
        throw new Error('User could not be authenticated')  
      }
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
}

async function currentQuestion(req, res) {
  try{
    const currentUser = await User.getOneById(req.body.login_id)
    const response = await currentUser.getCurrentQ()

    res.status(200).json(response)
  } catch(err) {
    res.status(404).json({error: err.message})
  }
}


module.exports = {
    register, login, currentQuestion, updatePoints, resetPoints
} 