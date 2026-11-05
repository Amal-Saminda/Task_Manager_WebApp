const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {

    // 1. Get authorization header
    let token = req.headers.authorization;

    // 2. Check Bearer token
    if (token && token.startsWith("Bearer ")) {

      // 3. Extract actual JWT
      token = token.split(" ")[1];

      // 4. Verify JWT
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // 5. Find user from database
      req.user = await User.findById(decoded.id).select("-password");

      // 6. Check whether user exists
      if (!req.user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      // 7. Continue to next middleware/controller
      next();

    } else {

      return res.status(401).json({
        message: "Not authorized, no token"
      });

    }

  } catch (err) {

    return res.status(401).json({
      message: "Token failed",
      error: err.message
    });

  }
};


// Admin access middleware
const adminOnly = (req, res, next) => {

  if (req.user && req.user.role === "admin") {

    next();

  } else {

    return res.status(403).json({
      message: "Access denied, admin only"
    });

  }
};

module.exports = { protect, adminOnly };