    // backend/middleware/authMiddleware.js
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');

    const protect = async (req, res, next) => {
      let token;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          // Get token from header
          token = req.headers.authorization.split(' ')[1];

          // Verify token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          // Attach user to the request object (without password)
          req.user = await User.findById(decoded.id).select('-password');

          next();
        } catch (error) {
          console.error(error);
          res.status(401).json({ message: 'Not authorized, token failed' });
        }
      }

      if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
      }
    };

    // Middleware to authorize users based on roles
    const authorize = (roles) => {
      return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Not authorized to access this route' });
        }
        next();
      };
    };

    // *** Ensure both protect and authorize are exported ***
    module.exports = { protect, authorize }; // <-- Yeh line theek karein
    