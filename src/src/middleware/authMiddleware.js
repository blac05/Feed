import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from Bearer string
      token = req.headers.authorization.split(' ')[1];

      // Verify signature against environment secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'feed_ultra_secret_2026');

      // Attach user metadata context to request pipeline
      req.user = { id: decoded.id, role: decoded.role };
      
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided' });
  }
};