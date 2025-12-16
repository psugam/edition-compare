// api/middleware/auth.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; // 🚨 CHANGE THIS IN PRODUCTION

/**
 * Middleware to verify JWT token and attach user to the request.
 * @param {Array<string>} roles - Optional array of required roles (e.g., ['admin'])
 */
const protect = (roles = []) => {
  return (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from header (Format: Bearer <token>)
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if user role satisfies required roles (Authorization)
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      // Attach user role and ID to the request
      req.user = { id: decoded.id, role: decoded.role };

      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  };
};

// Export the specific middleware needed for admin access
module.exports.protect = protect;
module.exports.adminOnly = protect(["admin"]);
