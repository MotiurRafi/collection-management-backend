const jwt = require('jsonwebtoken');
const db = require('../models')
const userAuth = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  const token = authorizationHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'jwt_secret', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

const adminAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'jwt_secret', async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const userRole = decoded.role;
    if (userRole !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const existingUser = await db.User.findOne({ where: { id: decoded.id } })
    if (existingUser.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  });
};

module.exports = { userAuth, adminAuth };
