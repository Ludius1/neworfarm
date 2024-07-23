const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');

const protect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      // Verify token
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decoded token:', verified);

      // Get user from the token
      const user = await Users.findById(verified.id).select('-password');

      if (user) {
        // If user exists, then attach it to the request and proceed
        req.user = user;
        next(); 
      } else {
        return res.status(401).json({ msg: 'Unauthorized! Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ msg: 'Invalid token provided', error: error.msg });
    }
  } else {
    res.status(400).json({ msg: 'No token provided' });
  }
};

module.exports = { protect };
