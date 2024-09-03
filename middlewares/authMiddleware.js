const jwt = require('jsonwebtoken');
const db = require('../models');

const userAuth = async (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }
  const token = authorizationHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'jwt_secret', async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    try {
      const userData = await db.User.findOne({
        where: { id: decoded.id },
        attributes: { exclude: ['password'] }
      });
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = userData;
      next();
    } catch (dbError) {
      return res.status(500).json({ message: 'Database error', error: dbError.message });
    }
  });
};

const adminAuth = async (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }
  const token = authorizationHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'jwt_secret', async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    try {
      const userData = await db.User.findOne({
        where: { id: decoded.id },
        attributes: { exclude: ['password'] }
      });
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (userData.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      req.user = userData;
      next();
    } catch (dbError) {
      return res.status(500).json({ message: 'Database error', error: dbError.message });
    }
  });
};

module.exports = { userAuth, adminAuth };
