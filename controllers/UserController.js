const validator = require('validator');
const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const snowflake = require("@theinternetfolks/snowflake");


const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};


const UserController = {
  async signUp(req, res) {
    try {
      const { name, email, password } = req.body;
  
      // Validate email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
      // Create user with hashed password
      const newUser = await Users.create({
        id: snowflake.Snowflake.generate(),
        name,
        email,
        password: hashedPassword,
      });
  
      return res.status(201).json({ user: newUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },
  

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      // Validate email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      // Check if user exists
      const user = await Users.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create and sign a token for authentication
      const token = jwt.sign({ userId: user.id }, 'my-32-character-ultra-secure-and-ultra-long-secret', {
        expiresIn: '1h',
      });

      return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },

  
  async getMe(req, res) {
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Verify the token
      const decoded = verifyToken(token);
  
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await Users.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      return res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  },
  

};

module.exports = UserController;
