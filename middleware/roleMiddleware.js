// middleware/roleMiddleware.js

// Middleware to check for specific roles
exports.is = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires ${roles.join(' or ')} role.` });
    }
    next();
  };
};