const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const createJWTToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, email: user.email , role: user.role, status: user.status }, 'jwt_secret', { expiresIn: '4h' });
};

exports.register = async (req, res) => {
  
  const { username, email, password } = req.body;
  try {
    const existingUserByUsername = await db.User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(409).json({ message: "Username already exists, use a different username" });
    }
    const existingUserByEmail = await db.User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(409).json({ message: "Email already exists, use a different email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      username,
      email,
      password: hashedPassword,
    });
    const createdUser = await db.User.findOne({
      where: { email },
      attributes: { exclude: ['password','role','status'] }
  });    res.status(200).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password incorrect' });
    }

    const token = createJWTToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};