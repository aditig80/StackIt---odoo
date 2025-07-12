const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Admins only' });
  next();
}

module.exports = { auth, isAdmin };