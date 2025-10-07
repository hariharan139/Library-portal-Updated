const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

// Protect routes - Verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Format: "Bearer TOKEN")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get student from token (decoded contains student id)
      req.student = await Student.findById(decoded.id).select("-password");

      if (!req.student) {
        return res.status(401).json({
          success: false,
          message: "Student not found",
        });
      }

      // Check if student account is active
      if (!req.student.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated. Please contact admin.",
        });
      }

      // If everything is good, proceed to next middleware
      next();
    } catch (error) {
      console.error("Token verification error:", error);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};
