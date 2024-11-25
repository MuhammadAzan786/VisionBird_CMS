const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies.access_token;

  // Check if token is not provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Secret key used to verify the token
    const secretKey = process.env.JWT_SECRET || "your_secret_key";

    // Verify the token synchronously
    const decoded = jwt.verify(token, secretKey);

    // Attach the decoded user information to the request object
    req.user = decoded;

    console.log("Authenticated successfully, proceeding to authorization...");
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }

    // Handle other errors
    return res.status(500).json({ message: "Failed to authenticate token" });
  }
};

module.exports = authenticateToken;
